import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Estoque } from '../models/estoque';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class EstoqueService extends BaseService {
  private estoqueUrl = `${environment.safeApiUrl.fornecedor}Produto`; // É o antigo estoque, manteve a rota igual

  constructor(private http: HttpClient) {
    super();
  }

  override getAll(searchParams: any = null): Observable<Estoque[]> {
    return this.http
      .get<Estoque[]>(`${this.estoqueUrl}${this.getSearchString(searchParams)}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http.post(`${this.estoqueUrl}`, payload).pipe(
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
    return this.http.put(`${this.estoqueUrl}`, payload).pipe(
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
    return this.http.delete(`${this.estoqueUrl}/${id}`).pipe(
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
