"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoute = void 0;
const express_1 = require("express");
const AuthController_1 = require("../../controllers/AuthController");
const authenticateToken_1 = require("../../middleware/authenticateToken");
exports.AuthRoute = (0, express_1.Router)();
exports.AuthRoute.post("/register", AuthController_1.register);
exports.AuthRoute.get("/users", AuthController_1.users);
exports.AuthRoute.post("/login", AuthController_1.loginController);
exports.AuthRoute.get("/refresh-access-token", AuthController_1.refresh_token);
exports.AuthRoute.post("/middleware-testing", authenticateToken_1.authenticateToken, AuthController_1.MiddlewareTesting);
//# sourceMappingURL=authRoute.js.map