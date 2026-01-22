export interface IRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findById(id: string): Promise<T| null | never>;
  findAll(): Promise<T[] | never>;
  updateData(id: string, data: Partial<T>): Promise<T | null | never>;
  deleteData(id: string): Promise<boolean | never>;
}
