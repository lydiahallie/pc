"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const graphql_1 = require("graphql");
const schemaTypesBuilder_1 = require("./schemaTypesBuilder");
const schemaClasses_1 = require("./schemaClasses");
const constants_1 = require("./constants");
const typeBuilder = new schemaTypesBuilder_1.SchemaTypesBuilder();
class SchemaBuilder {
    constructor() {
        this.models = new schemaClasses_1.Models();
    }
    parseDataModel() {
        return graphql_1.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, "datamodel.graphql"), "utf-8"));
    }
    getModelTypeNames() {
        let typeNames = ['Int', 'Boolean', 'String', 'Float', 'ID'];
        const definitions = this.parseDataModel().definitions;
        definitions.map((def) => {
            typeNames = [...typeNames, def.name.value];
        });
        return typeNames;
    }
    getFieldProperties(def) {
        let fields = [];
        const typeNode = new schemaClasses_1.ModelTypeNode(def.name.value);
        def.fields.map((field) => {
            const { type, directives } = field;
            const nonNullType = type.kind === 'NonNullType';
            const isListType = type.type && type.type.kind === 'ListType';
            const isUnique = directives[0] && directives[0].name && directives[0].name.value === 'unique';
            const value = this.getFieldValue(field, nonNullType, isListType);
            const validFields = this.getModelTypeNames();
            if (validFields.includes(value)) {
                const name = field.name.value;
                fields.push(new schemaClasses_1.Field(name, value, nonNullType, isListType, isUnique));
                typeNode.addFields(fields);
            }
        });
        this.models.addModel(typeNode);
    }
    getFieldValue(field, isNonNullType, isListType) {
        let value;
        const fieldValue = field.type.type;
        if (isListType) {
            value = fieldValue.type.type.name.value;
        }
        else if (!isListType && isNonNullType) {
            value = fieldValue.name.value;
        }
        else {
            value = field.type && field.type.name && field.type.name.value;
        }
        return value;
    }
    getModelTypes() {
        const definitions = this.parseDataModel().definitions;
        definitions.map(definition => {
            this.getFieldProperties(definition);
        });
    }
    printModelSchema(models) {
        let aggregates = '';
        let buildString = '';
        models.models.map((model) => {
            const fields = model.fields;
            aggregates += `${typeBuilder.aggregateType(model)}`;
            buildString += `${typeBuilder.printType(model.name, fields)}${typeBuilder.printConnection(model)}${typeBuilder.createInput(model)}${typeBuilder.createEdge(model)}${typeBuilder.orderByInput(model)}${typeBuilder.previousValues(model)}${typeBuilder.subscriptionPayload(model)}${typeBuilder.subscriptionWhereInput(model)}${typeBuilder.updateInput(model)}${typeBuilder.modelWhereInput(model)}${typeBuilder.whereUniqueInput(model)}`;
        });
        const batchPayload = `type BatchPayload {\n  count: Long! \n}\n\n`;
        const modelString = `${aggregates}${batchPayload}${typeBuilder.mutationType(models.models)}\n${constants_1.enumType}\n${constants_1.interfaceType}\n${constants_1.pageInfoType}\n${typeBuilder.queryType(models)}${typeBuilder.subscriptionType(models.models)}${buildString}`;
        fs_1.default.writeFileSync(path_1.default.join(__dirname, "schema.graphql"), modelString);
    }
    generateSchema() {
        return this.printModelSchema(this.models);
    }
    writeSchema() {
        this.parseDataModel();
        this.getModelTypes();
        return this.generateSchema();
    }
}
exports.SchemaBuilder = SchemaBuilder;
const builder = new SchemaBuilder;
builder.writeSchema();
