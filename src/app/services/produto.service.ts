import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Produto } from '../models/produto';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService extends BaseService {
  private produtoUrl = `${environment.safeApiUrl.fornecedor}produto`;

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: Nome | Ativo
  override getAll(searchParams: any = null): Observable<Produto[]> {
    return this.http
      .get<Produto[]>(
        `${this.produtoUrl}${this.getSearchString(searchParams)}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override getById(id: any): Observable<Produto> {
    return this.http
      .get<Produto>(`${this.produtoUrl}/${id}`, this.getAuthenticationHeaders())
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http
      .post(`${this.produtoUrl}`, payload, this.getAuthenticationHeaders())
      .pipe(
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
    return this.http
      .put(`${this.produtoUrl}`, payload, this.getAuthenticationHeaders())
      .pipe(
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
    return this.http
      .delete(`${this.produtoUrl}/${id}`, this.getAuthenticationHeaders())
      .pipe(
        map((ent) => {
          if (ent) {
            return ent;
          }
          return;
        }),
        catchError(this.handleServiceError<any>())
      );
  }
}
