"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandleMiddleware = void 0;
function errorHandleMiddleware(error, req, res, next) {
    const statusCode = error.statusCode ? error.statusCode : 500;
    console.log("error middleware:", error);
    if (error.operational) {
        return res
            .status(statusCode)
            .json({ error: error.message, name: error.name });
    }
    return res
        .status(statusCode)
        .json({ error: "Something went wrong", name: error.name });
}
exports.errorHandleMiddleware = errorHandleMiddleware;
//# sourceMappingURL=errorHandlerMiddleware.js.map