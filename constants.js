"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumType = `enum MutationType {\n  CREATED\n  UPDATED\n  DELETED \n}\n`;
exports.interfaceType = `interface Node {\n  id: ID!\n}\n`;
exports.pageInfoType = `type PageInfo {\n  hasNextPage: Boolean!\n  hasPreviousPage: Boolean!\n  startCursor: String\n  endCursor: String\n}\n`;
exports.mutationValues = ['create', 'update', 'delete', 'upsert', 'updateMany', 'deleteMany'];
exports.subscriptionValues = model => {
    return `  mutation: MutationType\n  node: ${model.name}\n  updatedFields: [String!]\n  previousValues: ${model.name}PreviousValues`;
};
exports.subscriptionFieldValues = model => [
    { name: 'AND', value: `[${model.name}SubscriptionWhereInput!]` },
    { name: 'OR', value: `[${model.name}SubscriptionWhereInput!]` },
    { name: 'NOT', value: `[${model.name}SubscriptionWhereInput!]` },
    { name: 'mutation_in', value: '[MutationType!]' },
    { name: 'updatedFields_contains', value: 'String' },
    { name: 'updatedFields_contains_every', value: '[String!]' },
    { name: 'updatedFields_contains_some', value: '[String!]' },
    { name: 'node', value: `${model.name}WhereInput` }
];
exports.whereInputFields = {
    // TODO: Make id and string the same.
    id: ['_not', '_in', '_not_in', '_lt', '_lte', '_gt', '_gte', '_contains', '_not_contains', '_starts_with', '_not_starts_with', '_ends_with', '_not_ends_with'],
    string: ['_not', '_in', '_not_in', '_lt', '_lte', '_gt', '_gte', '_contains', '_not_contains', '_starts_with', '_not_starts_with', '_ends_with', '_not_ends_with'],
    int: ['_not', '_in', '_not_in', '_lt', '_lte', '_gt', '_gte'],
    boolean: ['_not']
};
