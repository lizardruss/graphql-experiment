import {schema as FileType} from './file';

const DirectoryType = `
  union FileSystemObject = File | Directory

  type Directory {
    # Path of the directory
    path: String!
    
    # Timestamp when the directory was created
    createdAt: Float!

    # Files in this directory
    files(offset: Int, limit: Int): [FileSystemObject]
  }
`;

export const schema = () => [
  DirectoryType,
  FileType
];

export const resolvers = {
  Directory: {
    files(root, { offset, limit }, context) {
      return [];
    }
  }
};