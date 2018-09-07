import { ModelType,  ModelFieldType } from './types';

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
  fields: ModelFieldType[]

	constructor(name: string) {
		this.name = name;
		this.fields = [];
	}

	addField(fields: ModelFieldType[]) {
    this.fields = fields
	}
}

export class Field {
  name: string
  value: string
  nullType: boolean
  listType: boolean
  isUnique: boolean

	constructor(name: string, value: string, nullType: boolean, listType: boolean, isUnique: boolean) {
		this.name = name;
		this.value = value;
		this.nullType = nullType;
		this.listType = listType;
    this.isUnique = isUnique;
	}
}
