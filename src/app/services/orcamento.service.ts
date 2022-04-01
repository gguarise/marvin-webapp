import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Orcamento } from '../models/orcamento';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class OrcamentoService extends BaseService {
  private clienteUrl = `${environment.safeApiUrl.atendimento}orcamento`;

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: ClienteId | CarroId | DiaCadastro | MesCadastro | AnoCadastro |
  //               DiaAgendamento | MesAgendamento | AnoAgendamento
  override getAll(searchParams: any = null): Observable<Orcamento[]> {
    return this.http
      .get<Orcamento[]>(
        `${this.clienteUrl}${this.getSearchString(searchParams)}`
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override getById(id: any): Observable<Orcamento> {
    return this.http
      .get<Orcamento[]>(`${this.clienteUrl}/${id}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }
}
