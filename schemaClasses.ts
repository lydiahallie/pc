import { ModelType, FieldType, ModelFieldType } from './types';

export class Models {
  models: ModelType[]

	constructor() {
		this.models = [];
	}

	addModel(model: ModelType) {
		this.models.push(model);
	}
}

export class ModelTypeNode {
  name: string
  fields: ModelFieldType[] | string[]

	constructor(name: string) {
		this.name = name;
		this.fields = [];
	}

	addFields(fields: ModelFieldType[] | string[]) {
    this.fields = fields
	}
}

export class Field {
  name: string
  value: string
  nonNullType: boolean
  isListType: boolean
  isUnique: boolean

	constructor(name: string, value: string, nonNullType: boolean, isListType: boolean, isUnique: boolean) {
		this.name = name;
		this.value = value;
		this.nonNullType = nonNullType;
		this.isListType = isListType;
    this.isUnique = isUnique;
	}
}
