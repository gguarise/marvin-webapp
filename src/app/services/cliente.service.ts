import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente';
import { ViaCEP } from '../models/via-cep';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService extends BaseService {
  private clienteUrl = `${environment.safeApiUrl.cliente}cliente`;
  private viaCEPUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: Nome | Email | Cpf | Telefone | Ativo
  override getAll(searchParams: any = null): Observable<Cliente[]> {
    return this.http
      .get<Cliente[]>(
        `${this.clienteUrl}${this.getSearchString(searchParams)}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override getById(id: any): Observable<Cliente> {
    return this.http
      .get<Cliente>(`${this.clienteUrl}/${id}`, this.getAuthenticationHeaders())
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http
      .post(`${this.clienteUrl}`, payload, this.getAuthenticationHeaders())
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
      .put(`${this.clienteUrl}`, payload, this.getAuthenticationHeaders())
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
      .delete(`${this.clienteUrl}/${id}`, this.getAuthenticationHeaders())
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

  getEnderecoPorCEP(cep: string): Observable<ViaCEP> {
    return this.http
      .get<ViaCEP>(`${this.viaCEPUrl}${cep}/json`)
      .pipe(catchError(this.handleServiceError<any>()));
  }
}
