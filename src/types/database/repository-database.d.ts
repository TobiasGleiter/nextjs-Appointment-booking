/**
 * All functions a database repository should implement
 */
export interface DatabaseRepository<T> {
  updateOne(item: T, options?: Object): Promise<any>;
  insertOne(item: T, options?: Object): Promise<any>;
  countDocuments(query: Object): Promise<number>;
  findOne(query: T, options?: Object): Promise<any>;
  find(query: T, options?: Object): Promise<any>;
}
