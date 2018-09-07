"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schemaFieldGenerator_1 = require("./schemaFieldGenerator");
class SchemaTypesBuilder {
    constructor() {
        this.fieldGenerator = new schemaFieldGenerator_1.SchemaFieldGenerator;
    }
    inputType(name, fields) {
        return `type ${name} {\n${fields}\n}\n\n`;
    }
    printType(name, fields) {
        const hasID = fields.some((field) => field.name === 'id');
        const typeName = `${name} ${hasID ? 'implements Node' : ''}`;
        return this.inputType(typeName, this.fieldGenerator.printTypeFields(fields));
    }
}
exports.SchemaTypesBuilder = SchemaTypesBuilder;
