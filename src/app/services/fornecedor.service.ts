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
  private fornecedorUrl = `${environment.safeApiUrl.fornecedor}fornecedor`;

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: Nome
  override getAll(searchParams: any = null): Observable<Fornecedor[]> {
    return this.http
      .get<Fornecedor[]>(
        `${this.fornecedorUrl}${this.getSearchString(searchParams)}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http
      .post(`${this.fornecedorUrl}`, payload, this.getAuthenticationHeaders())
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
      .put(`${this.fornecedorUrl}`, payload, this.getAuthenticationHeaders())
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
      .delete(`${this.fornecedorUrl}/${id}`, this.getAuthenticationHeaders())
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
