import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Fornecedor } from '../models/fornecedor';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class FornecedorService extends BaseService {
  private fornecedorUrl = `${environment.apiUrl.fornecedor}fornecedor`;

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(`${this.fornecedorUrl}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  postFornecedor(payload: any): Observable<any> {
    return this.http.post(`${this.fornecedorUrl}`, payload).pipe(
      map((ent) => {
        if (ent) {
          return ent;
        }
        return;
      }),
      catchError(this.handleServiceError<any>())
    );
  }

  putFornecedor(payload: any): Observable<any> {
    return this.http.put(`${this.fornecedorUrl}`, payload).pipe(
      map((ent) => {
        if (ent) {
          return ent;
        }
        return;
      }),
      catchError(this.handleServiceError<any>())
    );
  }

  deleteFornecedor(id: string): Observable<any> {
    return this.http.delete(`${this.fornecedorUrl}/${id}`).pipe(
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
