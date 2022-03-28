import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class BaseService {
  constructor() {}

  getAll(searchParams: any = null): Observable<any[]> {
    throw new Error('Método GetAll não implementado.');
  }
  getByParent(parent: any, searchParams: any = null): Observable<any[]> {
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

  // search deve ser no formato:
  // { "NomeNaRota": "ValorParaPesquisar", "Nome": "João" }
  protected getSearchString(searchParams: any) {
    let searchString = '';
    if (!!searchParams) {
      for (var [key, value] of Object.entries(searchParams)) {
        searchString += `${key}=${value}&`;
      }
      searchString = '?' + searchString.slice(0, -1); // retira ultimo & adicionado
    }
    return searchString;
  }

  protected handleServiceError<T>() {
    return (error: any): Observable<T> => {
      throw error;
    };
  }

  getExternalHeader() {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json; charset=utf-8');
    return { headers: headers.set('Access-Control-Allow-Origin', '*') };
  }
}
