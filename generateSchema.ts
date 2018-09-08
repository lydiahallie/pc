import fs from 'fs';
import path from 'path';
import { parse } from 'graphql';
import { SchemaTypesBuilder } from './schemaTypesBuilder';
import { DocumentType, DefinitionType, FieldType, NameType, TypeType, ModelType, ModelFieldType, ModelsType } from './types';
import { Models, ModelTypeNode, Field } from './schemaClasses';
import { enumType, interfaceType, pageInfoType } from './constants';

const typeBuilder = new SchemaTypesBuilder();

export class SchemaBuilder {
  models: any

  constructor() {
    this.models = new Models();
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

  private getFieldProperties(def: DefinitionType): void {
    let fields: Array<ModelFieldType> = [];
    const typeNode = new ModelTypeNode(def.name.value);

    def.fields.map((field: FieldType) => {
      const { type, directives } = field;
      const nonNullType = type.kind === 'NonNullType';
      const isListType = type.type && type.type.kind === 'ListType';
      const isUnique = directives[0] && directives[0].name && directives[0].name.value === 'unique';
      const value = this.getFieldValue(field, nonNullType, isListType);
      const validFields = this.getModelTypeNames();

      if (validFields.includes(value)) {
        const name = field.name.value;
        fields.push(new Field(name, value, nonNullType, isListType, isUnique));
        typeNode.addFields(fields);
      }
    });
    this.models.addModel(typeNode);
  }

  private getFieldValue(field: FieldType, isNonNullType: boolean, isListType: boolean): string {
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

  public getModelTypes(): void {
    const definitions = this.parseDataModel().definitions;
    
    definitions.map(definition => {
      this.getFieldProperties(definition);
    });
  }

  private printModelSchema(models: ModelsType): void {
    let aggregates = ''
    let buildString = '';
    models.models.map((model: ModelType) => {
      const fields = model.fields;
      aggregates += `${typeBuilder.aggregateType(model)}`
      buildString += `${typeBuilder.printType(model.name, fields)}${typeBuilder.printConnection(model)}${typeBuilder.createInput(model)}${typeBuilder.createEdge(model)}${typeBuilder.orderByInput(model)}${typeBuilder.previousValues(model)}${typeBuilder.subscriptionPayload(model)}${typeBuilder.subscriptionWhereInput(model)}${typeBuilder.updateInput(model)}${typeBuilder.modelWhereInput(model)}${typeBuilder.whereUniqueInput(model)}`
    });
    const batchPayload = `type BatchPayload {\n  count: Long! \n}\n\n`
    const modelString = `${aggregates}${batchPayload}${typeBuilder.mutationType(models.models)}\n${enumType}\n${interfaceType}\n${pageInfoType}\n${typeBuilder.queryType(models)}${typeBuilder.subscriptionType(models.models)}${buildString}`;
    
    fs.writeFileSync(
      path.join(__dirname, "schema.graphql"),
      modelString
    );
  }

  public generateSchema(): void {
    return this.printModelSchema(this.models);
  }

  public writeSchema(): void {
    this.parseDataModel();
    this.getModelTypes();
    return this.generateSchema();
  }
}

const builder = new SchemaBuilder;
builder.writeSchema();