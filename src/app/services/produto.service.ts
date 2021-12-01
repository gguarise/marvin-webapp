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
  private produtoUrl = `${environment.apiUrl.estoque}Produto`;

  constructor(private http: HttpClient) {
    super();
  }

  getAll(): Observable<Produto[]> {
    return this.http
      .get<Produto[]>(`${this.produtoUrl}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  postProduto(payload: any): Observable<any> {
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

  putProduto(payload: any): Observable<any> {
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

  deleteProduto(id: string): Observable<any> {
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
