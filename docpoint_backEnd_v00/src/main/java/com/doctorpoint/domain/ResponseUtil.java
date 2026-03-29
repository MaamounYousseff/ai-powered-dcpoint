package com.doctorpoint.domain;


public class ResponseUtil {

    public static <T> ApiResponse<T> createSuccessResponse(T data, String message) {
        return ApiResponse.success(data, message);
    }

    public static <T> ApiResponse<T> createSuccessResponse(T data) {
        return ApiResponse.success(data);
    }

    public static <T> ApiResponse<T> createErrorResponse(String message) {
        return ApiResponse.error(message);
    }

    public static <T> ApiResponse<T> createErrorResponse(T data, String message) {
        return ApiResponse.error(data, message);
    }
}
