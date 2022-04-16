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
  private servicoUrl = `${environment.safeApiUrl.atendimento}servico`;

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: Nome
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
}
