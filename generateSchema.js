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
        ;
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
    getModelTypes() {
        const definitions = this.parseDataModel().definitions;
        definitions.map(definition => {
            this.getFieldProperties(definition);
        });
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
    getFieldProperties(def) {
        let fields = [];
        const typeNode = new schemaClasses_1.ModelTypeNode(def.name.value);
        if (def.kind === 'ScalarTypeDefinition')
            return;
        def.fields.map((field) => {
            const { type, directives } = field;
            const nullType = type.kind === 'NonNullType';
            const listType = type.type && type.type.kind === 'ListType';
            const isUnique = directives[0] && directives[0].name && directives[0].name.value === 'unique';
            const value = this.getFieldValue(field, nullType, listType);
            const validFields = this.getModelTypeNames();
            if (validFields.includes(value)) {
                const name = field.name.value;
                fields.push(new schemaClasses_1.Field(name, value, nullType, listType, isUnique));
                typeNode.addField(fields);
            }
        });
        this.models.addModel(typeNode);
    }
    printModelSchema(models) {
        let aggregates = '';
        let buildString = '';
        models.models.map((model) => {
            aggregates += `${typeBuilder.aggregateType(model)}`;
            buildString += `${typeBuilder.printType(model.name, model.fields)}`;
        });
        const modelString = `${aggregates}${constants_1.batchPayload}${buildString}`;
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
const schemaBuilder = new SchemaBuilder();
schemaBuilder.writeSchema();
