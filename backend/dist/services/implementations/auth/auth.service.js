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
exports.authService = exports.AuthService = void 0;
const typedi_1 = __importStar(require("typedi"));
const user_repository_1 = require("../../../repositories/implementations/user.repository");
const customError_1 = require("../../../utils/customError");
const httpStatus_1 = require("../../../enum/httpStatus");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../../../utils/jwt");
const CloudinaryUploads_1 = require("../../../utils/CloudinaryUploads");
// import BaseRepository  from "../../../repositories/base.repository";
const fs = require('fs');
let AuthService = class AuthService {
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    async signUp(userData, file) {
        try {
            const { name, email, password, confirmPassword } = userData;
            let Image;
            console.log("service layer", name, email, password, confirmPassword);
            console.log("file", file);
            if (file?.path) {
                Image = await (0, CloudinaryUploads_1.uploadToCloudinary)(file.path);
                fs.unlinkSync(file.path);
            }
            const existUser = await this.userRepo.findUserByEmail(email);
            console.log("existUser", existUser);
            if (existUser) {
                console.log("existUser is already exist");
                throw new customError_1.AppError("User already registered with this email , Please login...", httpStatus_1.HttpStatus.BAD_REQUEST);
            }
            const hashedPassword = await bcrypt_1.default.hash(password, 8);
            console.log("hashedPassword", hashedPassword);
            await this.userRepo.create({
                image: Image,
                name,
                email,
                password: hashedPassword,
            });
            return { message: "good", success: true };
        }
        catch (error) {
            if (error instanceof customError_1.AppError) {
                throw error;
            }
            throw new customError_1.AppError(error.message || "Internal Server Error", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async signIn(userData) {
        try {
            const { email, password } = userData;
            console.log("signIn in authService", email);
            const exist = await this.userRepo.findUserByEmail(email);
            if (!exist) {
                throw new customError_1.AppError("invalid credential", httpStatus_1.HttpStatus.BAD_REQUEST);
            }
            let comparePassword = await bcrypt_1.default.compare(password, exist.password);
            if (!comparePassword) {
                throw new customError_1.AppError("invalide password", httpStatus_1.HttpStatus.BAD_REQUEST);
            }
            // const accessToken = generateAccessToken({ id: exist._id });
            const accessToken = (0, jwt_1.generateAccessToken)(exist.id);
            // const refreshToken = generateRefreshToken({ id: exist._id });
            const refreshToken = (0, jwt_1.generateRefreshToken)(exist.id);
            console.log("exist", exist);
            return {
                success: true,
                message: "signIn is succesfully complated",
                accessToken: accessToken,
                refreshToken: refreshToken,
                user: {
                    id: exist._id.toString(),
                    image: exist.image.url,
                    name: exist.name,
                    email: exist.email,
                },
            };
        }
        catch (error) {
            if (error instanceof customError_1.AppError) {
                throw error;
            }
            throw new customError_1.AppError("An error occurred while signing in. Please try again later.", httpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, typedi_1.Service)(),
    __param(0, (0, typedi_1.Inject)(() => user_repository_1.UserRepository)),
    __metadata("design:paramtypes", [Object])
], AuthService);
exports.authService = typedi_1.default.get(AuthService);
