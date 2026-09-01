"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = exports.AuthControllers = void 0;
const typedi_1 = __importStar(require("typedi"));
const auth_service_1 = require("../../services/implementations/auth/auth.service");
const user_Zvalidations_1 = require("../../validations/user.Zvalidations");
const httpStatus_1 = require("../../enum/httpStatus");
const cookies_utils_1 = require("../../utils/cookies.utils");
const customError_1 = require("../../utils/customError");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_1 = require("../../utils/jwt");
let AuthControllers = class AuthControllers {
    constructor(authService) {
        this.authService = authService;
    }
    async signUp(req, res) {
        try {
            console.log("requu", req.body);
            console.log("requu", req.file);
            let image;
            const validationCheck = user_Zvalidations_1.registerSchema.safeParse(req.body);
            if (!validationCheck.success) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: validationCheck.error,
                });
            }
            console.log("after complate validations");
            const response = await this.authService.signUp(req.body, req.file);
            console.log("res", response);
            return res.status(201).json({ data: response }); // <- IMPORTANT
        }
        catch (error) {
            // return res.status(500).json({error, message: "something wrong" });
            if (error instanceof customError_1.AppError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, success: false });
            }
            console.error("Error in signup:", error);
            return res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    }
    async signIn(req, res) {
        try {
            const { email, password } = req.body;
            console.log(" email, password", email, password);
            const signInValidation = user_Zvalidations_1.signInSchema.safeParse(req.body);
            console.log("signInValidation", signInValidation);
            if (!signInValidation.success) {
                return res.status(httpStatus_1.HttpStatus.BAD_REQUEST).json({
                    success: false,
                    message: signInValidation.error,
                });
            }
            const response = await this.authService.signIn({ email, password });
            console.log("response auth.controller", response);
            (0, cookies_utils_1.setCookies)(res, String(response.accessToken), String(response.refreshToken));
            console.log("suceeeeeeeeee");
            return res.status(httpStatus_1.HttpStatus.OK).json({
                success: true,
                message: "Sign in successfully completed",
                user: response.user,
            });
        }
        catch (error) {
            if (error instanceof customError_1.AppError) {
                return res
                    .status(error.statusCode)
                    .json({ message: error.message, success: false });
            }
            console.log("signin error", error);
            return res
                .status(httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ success: false, message: "Internal server error" });
        }
    }
    async refreshToken(req, res) {
        try {
            const token = req.cookies.refreshToken;
            console.log("Refresh cookie:", req.cookies);
            console.log("Refresh token:", req.cookies.refreshToken);
            console.log("controller refreshtoken", token);
            if (!token) {
                throw new customError_1.AppError("Refresh token missing", 401);
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.REFRESH_TOKEN);
            const newAccessToken = (0, jwt_1.generateAccessToken)(decoded.user);
            (0, cookies_utils_1.setCookies)(res, newAccessToken, token);
            return res.status(200).json({
                success: true,
                message: "Access token refreshed",
            });
        }
        catch (error) {
            console.error("Refresh token error:", error);
            return res.status(401).json({
                message: "Invalid refresh token",
                error,
            });
        }
    }
    async getCurrentUser(req, res) {
        try {
            console.log('token in getCurrentUser ');
            const token = req.cookies.accessToken;
            console.log('token in getCurrentUser', token);
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Not authenticated",
                });
            }
            const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN);
            console.log('decoded in getCurrentUser', decoded);
            return res.status(200).json({
                success: true,
                userId: decoded.id,
            });
        }
        catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired access token",
            });
        }
    }
};
exports.AuthControllers = AuthControllers;
exports.AuthControllers = AuthControllers = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => auth_service_1.AuthService)),
    __metadata("design:paramtypes", [Object])
], AuthControllers);
exports.authControllers = typedi_1.default.get(AuthControllers);
