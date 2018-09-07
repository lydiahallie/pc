export const enumType = `enum MutationType {\n  CREATED\n  UPDATED\n  DELETED \n}\n`;
export const interfaceType = `interface Node {\n  id: ID!\n}\n`;
export const pageInfoType = `type PageInfo {\n  hasNextPage: Boolean!\n  hasPreviousPage: Boolean!\n  startCursor: String\n  endCursor: String\n}\n`;
export const batchPayload = `type BatchPayload {\n  count: Long!\n}\n`