import { SchemaFieldType, ModelType, ModelFieldType } from './types';

export class SchemaFieldGenerator { 

  public generateSchemaField(field: SchemaFieldType | Array<string | boolean>): string {
    const { name, isList, value, fieldValueRequired, fieldRequired } = field;
    return `  ${name}: ${isList ? '[' : ''}${value}${fieldValueRequired ? '!' : ''}${isList ? ']' : ''}${fieldRequired ? '!' : ''}`;
  }

  public printTypeFields(fields: SchemaFieldType[]) {
    return fields.map((field: SchemaFieldType) => this.generateSchemaField(field)).join('\n')
  }
}