"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SchemaFieldGenerator {
    generateSchemaField(field) {
        const { name, isList, value, fieldValueRequired, fieldRequired } = field;
        return `  ${name}: ${isList ? '[' : ''}${value}${fieldValueRequired ? '!' : ''}${isList ? ']' : ''}${fieldRequired ? '!' : ''}`;
    }
    printTypeFields(fields) {
        return fields.map((field) => this.generateSchemaField(field)).join('\n');
    }
}
exports.SchemaFieldGenerator = SchemaFieldGenerator;
