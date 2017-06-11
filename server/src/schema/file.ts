import {schema as DirectoryType} from './directory';

class File {
  path: string;
  createdAt: number;
  size: number;
  
  static getFile(path: String) : File {
    const file = new File();
    file.path = '/poop.txt';
    file.createdAt = Date.now();
    file.size = 0;
    return file;
  }
}

const FileType = `
  type File { 
    # Path of the file
    path: String!

    # Timestamp when the file was created
    createdAt: Float!

    # Size of the file in bytes
    size: Int!

    # Parent directory of the file
    parent: Directory

    # Contents of the file
    contents: String
  }
`;

export const schema = () => [
  FileType,
  DirectoryType
];

export const model = File;

export const resolvers = {
  File: {
    parent(root, args, context) {
      return {
        path: '/',
        createdAt: +Date.now()
      }
    },
    contents() {
      return 'Buncha stuff.'
    }
  }
};