import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orcamento } from '../models/orcamento';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class OrcamentoService extends BaseService {
  private orcamentoUrl = `${environment.safeApiUrl.atendimento}orcamento`;

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: ClienteId | CarroId | Status | DiaCadastro | MesCadastro | AnoCadastro |
  //               DiaAgendamento | MesAgendamento | AnoAgendamento
  override getAll(searchParams: any = null): Observable<Orcamento[]> {
    return this.http
      .get<Orcamento[]>(
        `${this.orcamentoUrl}${this.getSearchString(searchParams)}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override getById(id: any): Observable<Orcamento> {
    return this.http
      .get<Orcamento>(
        `${this.orcamentoUrl}/${id}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http
      .post(`${this.orcamentoUrl}`, payload, this.getAuthenticationHeaders())
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
      .put(`${this.orcamentoUrl}`, payload, this.getAuthenticationHeaders())
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
      .delete(`${this.orcamentoUrl}/${id}`, this.getAuthenticationHeaders())
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
