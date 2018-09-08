"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Models {
    constructor() {
        this.models = [];
    }
    addModel(model) {
        this.models.push(model);
    }
}
exports.Models = Models;
class ModelTypeNode {
    constructor(name) {
        this.name = name;
        this.fields = [];
    }
    addFields(fields) {
        this.fields = fields;
    }
}
exports.ModelTypeNode = ModelTypeNode;
class Field {
    constructor(name, value, nonNullType, isListType, isUnique) {
        this.name = name;
        this.value = value;
        this.nonNullType = nonNullType;
        this.isListType = isListType;
        this.isUnique = isUnique;
    }
}
exports.Field = Field;
