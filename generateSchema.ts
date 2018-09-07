import fs from 'fs';
import path from 'path';
import { parse } from 'graphql';

import { SchemaTypesBuilder } from './schemaTypesBuilder';
import { Models, ModelTypeNode, Field } from './schemaClasses';
import { DocumentType, DefinitionType, ModelFieldType, FieldType, ModelType } from './types';
import { batchPayload } from './constants';

const typeBuilder = new SchemaTypesBuilder();

export class SchemaBuilder {
  models: any
  
  constructor() {
    this.models = new Models();;
  }

  public parseDataModel(): DocumentType {
    return parse(fs.readFileSync(path.join(__dirname, "datamodel.graphql"), "utf-8"));
  }

  public getModelTypeNames(): Array<any> {
    let typeNames: Array<string> = ['Int', 'Boolean', 'String', 'Float', 'ID'];
    const definitions = this.parseDataModel().definitions;
    definitions.map((def: DefinitionType) => {
      typeNames = [...typeNames, def.name.value];
    });
    return typeNames;
  }

  public getModelTypes(): void {
    const definitions = this.parseDataModel().definitions;
    
    definitions.map(definition => {
      this.getFieldProperties(definition);
    });
  }

  private getFieldValue(field: any, isNonNullType: boolean, isListType: boolean): string {
    let value;
    const fieldValue = field.type.type;
    if (isListType) {
      value = fieldValue.type.type.name.value
    } else if (!isListType && isNonNullType) {
      value = fieldValue.name.value;
    } else {
      value = field.type && field.type.name && field.type.name.value;
    }
    return value;
  }

  private getFieldProperties(def: DefinitionType): void {
    let fields: Array<ModelFieldType> = [];
    const typeNode = new ModelTypeNode(def.name.value);

    if (def.kind === 'ScalarTypeDefinition') return;

    def.fields.map((field: FieldType) => {
      const { type, directives } = field;
      const nullType = type.kind === 'NonNullType';
      const listType = type.type && type.type.kind === 'ListType';
      const isUnique = directives[0] && directives[0].name && directives[0].name.value === 'unique';
      const value = this.getFieldValue(field, nullType, listType);
      const validFields = this.getModelTypeNames();

      if (validFields.includes(value)) {
        const name = field.name.value;
        fields.push(new Field(name, value, nullType, listType, isUnique));
        typeNode.addField(fields);
      }
    });
    this.models.addModel(typeNode);
  }

  private printModelSchema(models: Models): void {
    let aggregates = '';
    let buildString = '';
    models.models.map((model: ModelType) => {
      aggregates += `${typeBuilder.aggregateType(model)}`;
      buildString += `${typeBuilder.printType(model.name, model.fields)}`
    });

    const modelString = `${aggregates}${batchPayload}${buildString}`

    fs.writeFileSync(
      path.join(__dirname, "schema.graphql"),
      modelString
    );
  }

  public generateSchema(): void {
    return this.printModelSchema(this.models);
  }

  public writeSchema(): any {
    this.parseDataModel();
    this.getModelTypes();
    return this.generateSchema();
  }
}

const schemaBuilder = new SchemaBuilder();
schemaBuilder.writeSchema();