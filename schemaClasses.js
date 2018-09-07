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
    addField(fields) {
        this.fields = fields;
    }
}
exports.ModelTypeNode = ModelTypeNode;
class Field {
    constructor(name, value, nullType, listType, isUnique) {
        this.name = name;
        this.value = value;
        this.nullType = nullType;
        this.listType = listType;
        this.isUnique = isUnique;
    }
}
exports.Field = Field;
