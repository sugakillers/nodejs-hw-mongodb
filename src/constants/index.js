import path from 'node:path';
export const SORT_ORDER = {
    ASC: 'asc',
    DESC: 'desc',
  };
  export * from './upload.js';
  export const SWAGGER_PATH = path.join(process.cwd(), 'docs', 'swagger.json');