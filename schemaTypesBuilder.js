"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemaFieldGenerator_1 = require("./schemaFieldGenerator");
class SchemaTypesBuilder {
    constructor() {
        this.fieldGenerator = new schemaFieldGenerator_1.SchemaFieldGenerator;
    }
    generateScalar(scalar) {
        return `scalar ${scalar}`;
    }
    inputType(name, fields) {
        return `type ${name} {\n${fields}\n}\n\n`;
    }
    enumType(name, fields) {
        return `enum ${name} {\n${fields}\n}\n\n`;
    }
    inputInputType(name, fields) {
        return `input ${name} {\n${fields}\n}\n\n`;
    }
    pageInfoType(model) {
        return `  pageInfo: PageInfo!\n  edges: [${model.name}Edge]! \n  aggregate: Aggregate${model.name}!`;
    }
    printType(name, fields) {
        const hasID = fields.some((field) => field.name === 'id');
        const typeName = `${name} ${hasID ? 'implements Node' : ''}`;
        return this.inputType(typeName, this.fieldGenerator.printTypeFields(fields));
    }
    scalarType(name) {
        return `scalar ${name} \n\nscalar Long\n\n`;
    }
    updateInput(model) {
        return this.inputType(`${model.name}UpdateInput`, this.fieldGenerator.printInputTypeFields(model.fields));
    }
    subscriptionPayload(model) {
        return this.inputType(`${model.name}SubscriptionPayload`, this.fieldGenerator.subscriptionPayloadFields(model));
    }
    aggregateType(model) {
        return this.inputType(`Aggregate${model.name}`, '  count: Int!');
    }
    mutationType(model) {
        return this.inputType('Mutation', this.fieldGenerator.generateMutationFields(model));
    }
    queryType(model) {
        return this.inputType('Query', this.fieldGenerator.generateQueryFields(model.models));
    }
    subscriptionType(models) {
        return this.inputType('Subscription', this.fieldGenerator.generateSubscriptionTypeFields(models));
    }
    previousValues(model) {
        return this.inputType(`${model.name}PreviousValues`, this.fieldGenerator.printTypeFields(model.fields));
    }
    orderByInput(model) {
        return this.enumType(`${model.name}OrderByInput`, this.fieldGenerator.orderEnumFields(model));
    }
    whereUniqueInput(model) {
        if (model.fields.some(field => field.isUnique || field.name === "id")) {
            return this.inputInputType(`${model.name}WhereUniqueInput`, this.fieldGenerator.generateUniqueInputFields(model));
        }
        return null;
    }
    createEdge(model) {
        return this.inputType(`${model.name}Edge`, `  node: ${model.name}!\n  cursor: String!`);
    }
    createInput(model) {
        // TODO: Remove weird way of not rendering type.
        if (!model.fields.length || model.fields.every(field => field.name === 'id'))
            return '';
        return this.inputType(`${model.name}CreateInput`, this.fieldGenerator.printTypeFields(model.fields));
    }
    printConnection(model) {
        return this.inputType(`${model.name}Connection`, this.pageInfoType(model));
    }
    subscriptionWhereInput(model) {
        return this.inputInputType(`${model.name}SubscriptionWhereInput`, this.fieldGenerator.generateSubcriptionFields(model));
    }
    modelWhereInput(model) {
        return this.inputInputType(`${model.name}WhereInput`, this.fieldGenerator.generateWhereInputFields(model));
    }
}
exports.SchemaTypesBuilder = SchemaTypesBuilder;
