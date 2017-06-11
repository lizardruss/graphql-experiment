import * as merge from 'lodash.merge';
import { makeExecutableSchema } from 'graphql-tools';
import { schema as directorySchema, resolvers as directoryResolvers } from './directory';
import { schema as fileSchema, model as File, resolvers as fileResolvers } from './file';

const rootSchema = `
  type Query {
    file(
      # Path of the file
      path: String!
    ): File

    directory(
      # Path of the directory
      path: String!
    ): Directory
  }
`;

const rootResolvers = {
  Query: {
    file(root, { path }, context) : File {
      return context.File.getFile(path);
    },
    directory(root, { path }, context) {
      return {
        path: '/',
        createdAt: +Date.now()
      }
    }
  }
};

export const schema = makeExecutableSchema({
  typeDefs: [rootSchema, fileSchema, directorySchema],
  resolvers: merge(rootResolvers, fileResolvers, directoryResolvers)
});