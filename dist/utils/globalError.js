"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalError = void 0;
class GlobalError extends Error {
    constructor(msg, name, statusCode, operational, stack) {
        super(msg);
        this.operational = operational;
        this.statusCode = statusCode;
        this.name = name;
        this.stack = stack;
    }
}
exports.GlobalError = GlobalError;
//# sourceMappingURL=globalError.js.map