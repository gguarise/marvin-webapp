import { Observable } from 'rxjs';

export abstract class BaseService {
  constructor() {}

  getAll(search: any = null): Observable<any[]> {
    throw new Error('Método GetAll não implementado.');
  }
  getByParent(parent: any): Observable<any[]> {
    throw new Error('Método GetAll não implementado.');
  }
  getById(id: any): Observable<any> {
    throw new Error('Método GetAll não implementado.');
  }
  put(item: any): Observable<any> {
    throw new Error('Método Put não implementado.');
  }
  post(item: any): Observable<any> {
    throw new Error('Método Post não implementado.');
  }
  delete(id: any): Observable<any> {
    throw new Error('Método Delete não implementado.');
  }

  protected getSearchString(search: any) {
    return `${!!search ? `?Nome=${search}` : ''}`;
  }

  protected handleServiceError<T>() {
    return (error: any): Observable<T> => {
      throw error;
    };
  }
}
