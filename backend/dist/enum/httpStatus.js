"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseMessage = exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
    HttpStatus[HttpStatus["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
exports.responseMessage = {
    SUCCESS_MESSAGE: "Operation completed successfully.",
    ERROR_MESSAGE: "An error has occurred. Please try again later.",
    LOGIN_REQUIRED: "You must be logged in to access this feature.",
    ACCESS_DENIED: "You do not have permission to access this resource.",
    NOT_FOUND: "The requested resource was not found.",
    INVALID_INPUT: "The input provided is invalid.",
    INVALID_REQUEST: "Invalid Request",
    TOKEN_ACCESS: "Token not valid , Access declained",
    UPLOAD_FAILED: "Failed to upload , Try later",
};
