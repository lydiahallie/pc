import fs from 'fs';
import path from 'path';
import { parse } from 'graphql';

import { DocumentType } from './types';

export class SchemaBuilder {
  public parseDataModel(): DocumentType {
    return parse(fs.readFileSync(path.join(__dirname, "datamodel.graphql"), "utf-8"));
  }

  public writeSchema(): any {
    return this.parseDataModel();
  }
}

const schemaBuilder = new SchemaBuilder();
schemaBuilder.writeSchema();