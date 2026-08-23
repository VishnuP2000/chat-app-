"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
const mongoose_1 = require("mongoose");
const typedi_1 = require("typedi");
let BaseRepository = class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    async save(user) {
        return await user.save();
    }
    async findAll() {
        try {
            return await this.model.find().exec();
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (findAll): ${error.message}`);
            }
            throw new Error("Unknown error occurred in findAll");
        }
    }
    async findById(id) {
        try {
            console.log('base findById');
            const result = await this.model.findById(id).exec();
            if (!result)
                throw new Error(`No record found with ID: ${id}`);
            return result;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (findById): ${error.message}`);
            }
            throw new Error("Unknown error occurred in findById");
        }
    }
    async create(data) {
        try {
            console.log('enter the create model', data);
            let d = await this.model.create(data);
            console.log(d);
            return d;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (create): ${error.message}`);
            }
            throw new Error("Unknown error occurred in create");
        }
    }
    async updateData(id, data) {
        try {
            const updatedRecord = await this.model
                .findByIdAndUpdate(id, data, { new: true })
                .exec();
            if (!updatedRecord)
                throw new Error(`Update failed: No record found with ID: ${id}`);
            return updatedRecord;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (update): ${error.message}`);
            }
            throw new Error("Unknown error occurred in update");
        }
    }
    async updateById(id, update) {
        return this.model.findByIdAndUpdate(id, update, { new: true }).exec();
    }
    async deleteData(id) {
        try {
            const deletedRecord = await this.model.findByIdAndDelete(id).exec();
            if (!deletedRecord)
                throw new Error(`Delete failed: No record found with ID: ${id}`);
            return true;
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Database Error (delete): ${error.message}`);
            }
            throw new Error("Unknown error occurred in delete");
        }
    }
};
exports.BaseRepository = BaseRepository;
exports.BaseRepository = BaseRepository = __decorate([
    (0, typedi_1.Service)(),
    __metadata("design:paramtypes", [mongoose_1.Model])
], BaseRepository);
