export interface BaseRepository<T> {
  retrieveDetail?(whereClauses: any, callback: (result: T[], error: any) => void): void;

  retrieve?(columns: string[], whereClauses: any, callback: (result: T[], error: any) => void): void;

  create(item: T, callback: (result: any, error: any) => void): void;

  update(item: T, callback: (result: any, error: any) => void): void;

  delete?(id: number, callback: (result: any, error: any) => void): void;
}
