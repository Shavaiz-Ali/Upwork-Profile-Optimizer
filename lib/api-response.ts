import { NextResponse } from "next/server";
import { HTTP_STATUS, HttpStatus } from "@/lib/constants/http-status";

interface SuccessResponseOptions<T> {
    data?: T;
    message?: string;
    status?: HttpStatus;
}

interface ErrorResponseOptions {
    error: string;
    status?: HttpStatus;
}

export function successResponse<T>({
    data,
    message,
    status = HTTP_STATUS.OK,
}: SuccessResponseOptions<T>) {
    return NextResponse.json(
        {
            success: true,
            ...(message && { message }),
            ...(data !== undefined && { data }),
        },
        { status }
    );
}

export function errorResponse({ error, status = HTTP_STATUS.INTERNAL_SERVER_ERROR }: ErrorResponseOptions) {
    return NextResponse.json(
        {
            success: false,
            error,
        },
        { status }
    );
}
