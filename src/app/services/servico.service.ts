import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Servico } from '../models/servico';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ServicoService extends BaseService {
  private servicoUrl = `${environment.apiUrl.atendimento}Servico`;

  constructor(private http: HttpClient) {
    super();
  }

  override getAll(search: any = null): Observable<Servico[]> {
    return this.http
      .get<Servico[]>(`${this.servicoUrl}${this.getSearchString(search)}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http.post(`${this.servicoUrl}`, payload).pipe(
      map((ent) => {
        if (ent) {
          return ent;
        }
        return;
      }),
      catchError(this.handleServiceError<any>())
    );
  }

  override put(payload: any): Observable<any> {
    return this.http.put(`${this.servicoUrl}`, payload).pipe(
      map((ent) => {
        if (ent) {
          return ent;
        }
        return;
      }),
      catchError(this.handleServiceError<any>())
    );
  }

  override delete(id: string): Observable<any> {
    return this.http.delete(`${this.servicoUrl}/${id}`).pipe(
      map((ent) => {
        if (ent) {
          return ent;
        }
        return;
      }),
      catchError(this.handleServiceError<any>())
    );
  }

  // getByParent(empresa: number): Observable<ConfiguracaoAplicativo[]> {
  //   if (this.getCacheItem(empresa)) {
  //     return of(this.getCacheItem(empresa));
  //   }

  //   return this.http.get<ConfiguracaoAplicativo[]>(`${this.configuracaoAplicativoUrl}${empresa}`).pipe(
  //     switchMap(x => {
  //       this.setCacheItem(empresa, x);
  //       return of(x);
  //     }),
  //     catchError(this.handleServiceError<any>('getByParent', [])));

  // }

  // getByKey(item: any): Observable<ConfiguracaoOpcao[]> {
  //   const params = `Opcoes/${item}`;
  //   const cacheKey = `opcao-${item}`;

  //   if (this.getCacheItem(cacheKey)) {
  //     return of(this.getCacheItem(cacheKey));
  //   }

  //   return this.http.get<ConfiguracaoOpcao[]>(`${this.configuracaoAplicativoUrl}${params}`).pipe(
  //     switchMap(x => {
  //       this.setCacheItem(cacheKey, x);
  //       return of(x);
  //     }),
  //     catchError(this.handleServiceError<any>('getByKey', [])));
  // }

  // putConfiguracaoAplicativo(payload: any): Observable<ConfiguracaoAplicativo> {
  //   this.deleteAllCache();

  //   return this.http.
  //     put(`${this.configuracaoAplicativoUrl}${payload.empresa}`, payload).
  //     pipe(map(ent => {
  //       if (ent) {
  //         return ent;
  //       }
  //     }), catchError(this.handleServiceError<any>('putConfiguracaoAplicativo', [])));
  // }
}