"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumType = `enum MutationType {\n  CREATED\n  UPDATED\n  DELETED \n}\n`;
exports.interfaceType = `interface Node {\n  id: ID!\n}\n`;
exports.pageInfoType = `type PageInfo {\n  hasNextPage: Boolean!\n  hasPreviousPage: Boolean!\n  startCursor: String\n  endCursor: String\n}\n`;
exports.batchPayload = `type BatchPayload {\n  count: Long!\n}\n`;
