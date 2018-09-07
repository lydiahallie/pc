import { SchemaFieldGenerator } from './schemaFieldGenerator';
import { SchemaFieldType, FieldType, ModelType } from './types';


export class SchemaTypesBuilder {
  fieldGenerator: any

  constructor() {
    this.fieldGenerator = new SchemaFieldGenerator;    
  }

  private inputType(name: string, fields: SchemaFieldType[] | string): string {
    return `type ${name} {\n${fields}\n}\n\n`
  }

  public printType(name: string, fields: SchemaFieldType[] | Array<string>): string {
    const hasID = fields.some((field: FieldType) => field.name === 'id');
    const typeName = `${name} ${hasID ? 'implements Node' : ''}`;
    return this.inputType(
      typeName,
      this.fieldGenerator.printTypeFields(fields)
    );
  }
}