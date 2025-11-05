export interface IRepository<T> {
  create(data: T): Promise<T | never>;
  findById(id: string): Promise<T | null | never>;
  findAll(): Promise<T[] | never>;
  updateData(id: string, data: Partial<T>): Promise<T | null | never>;
  deleteData(id: string): Promise<boolean | never>;
}
