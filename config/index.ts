// config/axiosClient.ts
import axios, {
  AxiosRequestConfig,
  AxiosError,
  AxiosHeaders,
  InternalAxiosRequestConfig,
} from "axios";
import { getSession } from "next-auth/react";

const pendingRequests = new Map<string, Promise<any>>();
const cache = new Map<string, { data: any; timestamp: number }>();

const CACHE_TTL = 5000; // 5s

const getRequestKey = (config: AxiosRequestConfig) => {
  const { method, url, params, data } = config;
  return [
    method,
    url,
    JSON.stringify(params || {}),
    JSON.stringify(data || {}),
  ].join("&");
};

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/**
 * Local token cache + inflight getSession() promise dedupe
 */
let cachedAuthToken: string | undefined = undefined;
let getSessionPromise: Promise<string | undefined> | null = null;

/**
 * Public setter (keeps axios defaults in sync).
 */
export const setAxiosAuthToken = (token?: string) => {
  cachedAuthToken = token;
  if (token) {
    axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosClient.defaults.headers.common["Authorization"];
  }
};

/**
 * Resolve token with rules:
 *  - If cached -> return immediately
 *  - If axios default header has it -> sync + return
 *  - Else call getSession() once (deduped)
 */
async function resolveAuthToken(): Promise<string | undefined> {
  if (cachedAuthToken) return cachedAuthToken;

  const defaultHeader = axiosClient.defaults.headers.common["Authorization"];
  if (defaultHeader && typeof defaultHeader === "string") {
    const m = defaultHeader.match(/^Bearer\s+(.*)$/i);
    if (m) {
      cachedAuthToken = m[1];
      return cachedAuthToken;
    }
  }

  if (!getSessionPromise) {
    getSessionPromise = (async () => {
      try {
        const sess = await getSession();
        const token = sess?.accessToken;
        if (token) {
          cachedAuthToken = token;
          axiosClient.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token}`;
        }
        return token;
      } finally {
        getSessionPromise = null;
      }
    })();
  }

  return getSessionPromise;
}

/**
 * Utility to safely set header on Axios v1
 */
function setAuthHeader(
  config: InternalAxiosRequestConfig,
  token: string
): void {
  if (config.headers instanceof AxiosHeaders) {
    config.headers.set("Authorization", `Bearer ${token}`);
  } else {
    config.headers = new AxiosHeaders(config.headers);
    config.headers.set("Authorization", `Bearer ${token}`);
  }
}

// ---------------- INTERCEPTORS ----------------

// Request interceptor
axiosClient.interceptors.request.use(async (config) => {
  const hasAuthAlready =
    (config.headers instanceof AxiosHeaders &&
      config.headers.has("Authorization")) ||
    (axiosClient.defaults.headers.common["Authorization"] as
      | string
      | undefined);

  if (!hasAuthAlready) {
    const token = await resolveAuthToken();
    if (token) setAuthHeader(config, token);
  }

  if (
    config.url?.includes("/session") ||
    (config.method || "").toLowerCase() !== "get"
  ) {
    return config;
  }

  const key = getRequestKey(config);

  if (cache.has(key)) {
    const cached = cache.get(key)!;
    if (Date.now() - cached.timestamp < CACHE_TTL) {
      return Promise.reject({
        __fromCache: true,
        data: cached.data,
        config,
      });
    }
  }

  if (!pendingRequests.has(key)) {
    const requestPromise = Promise.resolve(config);
    pendingRequests.set(key, requestPromise);
  }

  return pendingRequests.get(key)!;
});

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    const key = getRequestKey(response.config);
    if ((response.config.method || "").toLowerCase() === "get") {
      cache.set(key, { data: response.data, timestamp: Date.now() });
    }
    pendingRequests.delete(key);
    return response;
  },
  async (error: any) => {
    if (error && error.__fromCache) {
      return Promise.resolve({
        data: error.data,
        config: error.config,
        status: 200,
        statusText: "OK (from cache)",
        headers: {},
      });
    }

    if (error?.config) {
      const key = getRequestKey(error.config);
      pendingRequests.delete(key);
    }

    const axiosErr = error as AxiosError;
    const status = axiosErr?.response?.status;
    const originalConfig = (axiosErr?.config || {}) as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (status === 401 && originalConfig && !originalConfig._retry) {
      originalConfig._retry = true;
      cachedAuthToken = undefined;
      delete axiosClient.defaults.headers.common["Authorization"];
      try {
        const token = await resolveAuthToken();
        if (token) {
          setAuthHeader(originalConfig as InternalAxiosRequestConfig, token);
          return axiosClient.request(originalConfig);
        }
      } catch {
        // ignore and fallthrough
      }
    }

    return Promise.reject(error);
  }
);
