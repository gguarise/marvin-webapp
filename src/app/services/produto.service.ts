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
  private produtoUrl = `${environment.apiUrl.fornecedor}Produto`;

  constructor(private http: HttpClient) {
    super();
  }

  override getAll(search: any = null): Observable<Produto[]> {
    return this.http
      .get<Produto[]>(`${this.produtoUrl}${this.getSearchString(search)}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http.post(`${this.produtoUrl}`, payload).pipe(
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
    return this.http.put(`${this.produtoUrl}`, payload).pipe(
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
    return this.http.delete(`${this.produtoUrl}/${id}`).pipe(
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
