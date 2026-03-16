export interface ActionResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export function successActionResponse<T>(data?: T, message?: string): ActionResponse<T> {
    return {
        success: true,
        data,
        message,
    };
}

export function errorActionResponse(error: string): ActionResponse {
    return {
        success: false,
        error,
    };
}
