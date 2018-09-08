"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pluralize_1 = __importDefault(require("pluralize"));
const constants_1 = require("./constants");
class SchemaFieldGenerator {
    generateSchemaField(field) {
        const { name, isListType, value, nonNullType } = field;
        return `  ${name}: ${isListType ? '[' : ''}${value}${nonNullType ? '!' : ''}${isListType ? ']' : ''}`;
    }
    subscriptionPayloadFields(model) {
        return constants_1.subscriptionValues(model);
    }
    generateMutationSchemaField(value, type) {
        const isUnique = type.fields.some((field) => field.name === 'id');
        const { name } = type;
        switch (value) {
            case 'create':
                return `  create${name}(data: ${name}CreateInput): [${name}!]`;
            case 'update':
                return isUnique ? `  update${name}(data: ${name}UpdateInput, where: ${name}WhereUniqueInput): ${name}` : null;
            case 'delete':
                return `  delete${name}(where: ${name}WhereUniqueInput): ${name}`;
            case 'upsert':
                return isUnique ? `  upsert${name}(where: ${name}WhereUniqueInput, create: ${name}CreateInput!, update: ${name}UpdateInput!): ${name}!` : null;
            case 'updateMany':
                return `  updateMany${pluralize_1.default(name)}(data: ${name}UpdateInput, where: ${name}WhereInput): BatchPayload!`;
            case 'deleteMany':
                return `  deleteMany${pluralize_1.default(name)}(where: ${name}WhereInput): BatchPayload!`;
        }
    }
    printTypeFields(fields) {
        return fields.map((field) => this.generateSchemaField(field)).join('\n');
    }
    generateMutationFields(model) {
        const printFields = (value, i) => {
            return model.map(type => {
                return this.generateMutationSchemaField(value, type);
            }).join('\n');
        };
        return constants_1.mutationValues.map((value, i) => printFields(value, i)).join('\n');
    }
    generateUniqueInputFields(model) {
        const values = model.fields.filter(field => field.isUnique || field.name === 'id');
        return values.map(value => `  ${value.name}: ${value.value}`).join('\n');
    }
    generateSubcriptionFields(model) {
        const values = constants_1.subscriptionFieldValues(model);
        return values.map(value => `  ${value.name}: ${value.value}`).join('\n');
    }
    generateSubscriptionTypeFields(models) {
        function printFields(model) {
            const { name } = model;
            return `  ${name.toLowerCase()}(where: ${name}SubscriptionWhereInput): ${name}SubscriptionPayload`;
        }
        return models.map(model => printFields(model)).join('\n');
    }
    printInputTypeFields(fields) {
        const uniqueFields = fields.filter(field => !field.isUnique || !field.name === "id");
        return uniqueFields.map(field => `  ${field.name}: ${field.value}`).join('\n');
    }
    generateQueryFields(models) {
        let queryString = '';
        function printQuery(type, name) {
            if (type === 'plural') {
                return `  ${pluralize_1.default(name.toLowerCase())}(where: ${name}WhereInput, orderBy: ${name}OrderInput, skip: Int, after: String, before: String, first: Int, last: Int): [${name}!]`;
            }
            return `  ${name.toLowerCase()}(where: ${name}WhereUniqueInput!): ${name}`;
        }
        // Find another way instead of mapping twice.
        models.map((model) => {
            queryString += `${printQuery('plural', model.name)}\n`;
        });
        models.map((model) => {
            if (model.fields.some(field => field.isUnique || field.name === 'id')) {
                queryString += `${printQuery('single', model.name)}\n`;
            }
        });
        return queryString;
    }
    generateWhereInputFields(model) {
        function printInputFields(field) {
            // TODO: Add support for top level types instead of making them default int.
            const fieldValue = Object.keys(constants_1.whereInputFields).includes(field.value.toLowerCase()) ? field.value.toLowerCase() : 'int';
            return constants_1.whereInputFields[fieldValue].map(inputField => {
                const fieldValue = inputField === '_in' || inputField === '_not_in' ? `[${field.value}!]` : field.value;
                return `  ${field.name}${inputField}: ${fieldValue}`;
            }).join('\n');
        }
        return `  AND: [${model.name}WhereInput!]\n  OR: [${model.name}WhereInput!]\n  NOT: [${model.name}WhereInput!]\n${model.fields.map(field => printInputFields(field)).join('\n')}`;
    }
    orderEnumFields(model) {
        return model.fields.map((field) => `  ${field.name}_ASC\n  ${field.name}_DESC`).join('\n');
    }
}
exports.SchemaFieldGenerator = SchemaFieldGenerator;
