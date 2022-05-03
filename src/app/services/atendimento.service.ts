import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AtendimentoService extends BaseService {
  private atendimentoUrl = `${environment.safeApiUrl.atendimento}atendimento/`;

  constructor(private http: HttpClient) {
    super();
  }

  // Agenda um orçamento
  putAgendar(payload: any): Observable<any> {
    return this.http
      .put(
        `${this.atendimentoUrl}agendar`,
        payload,
        this.getAuthenticationHeaders()
      )
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

  // Cancela um atendimento (volta a ser um simples orçamento)
  putCancelar(payload: any): Observable<any> {
    return this.http
      .put(
        `${this.atendimentoUrl}cancelar`,
        payload,
        this.getAuthenticationHeaders()
      )
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

  // Finaliza um atendimento (cliente atendido)
  putFinalizar(payload: any): Observable<any> {
    return this.http
      .put(
        `${this.atendimentoUrl}finalizar`,
        payload,
        this.getAuthenticationHeaders()
      )
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

  // Desfinaliza um atendimento (foi finalizado por engano)
  putDesfinalizar(payload: any): Observable<any> {
    return this.http
      .put(
        `${this.atendimentoUrl}desfinalizar`,
        payload,
        this.getAuthenticationHeaders()
      )
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
