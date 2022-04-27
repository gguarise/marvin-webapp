import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppInjectorService } from './app-injector.service';
import { TokenService } from './token.service';

export abstract class BaseService {
  httpBase: HttpClient;
  tokenService: TokenService;

  constructor() {
    this.tokenService = AppInjectorService.injector.get(TokenService);
    this.httpBase = AppInjectorService.injector.get(HttpClient);
  }

  getAll(searchParams: any = null): Observable<any[]> {
    throw new Error('Método GetAll não implementado.');
  }
  getByParent(parent: any, searchParams: any = null): Observable<any[]> {
    throw new Error('Método GetByParent não implementado.');
  }
  getById(id: any): Observable<any> {
    throw new Error('Método GetById não implementado.');
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

  private async getNewToken() {
    var request = new XMLHttpRequest();
    request.open('PUT', `${environment.safeApiUrl.autenticacao}login`, false);
    request.setRequestHeader('Content-type', 'application/json');
    request.send(JSON.stringify(environment.autenticacao));

    if (request.status === 200) {
      this.tokenService.token = JSON.parse(request.response)?.token;
    } else {
      throw new Error('Erro na conexão. Tente novamente.');
    }
  }

  getAuthenticationHeaders() {
    this.getNewToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.tokenService.token}`,
    });
    return { headers };
  }

  // getExternalHeader() {
  //   let headers = new HttpHeaders();
  //   headers = headers.set('Content-Type', 'application/json; charset=utf-8');
  //   return { headers: headers.set('Access-Control-Allow-Origin', '*') };
  // }
}
