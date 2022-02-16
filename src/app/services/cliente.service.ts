import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { ViaCEP } from '../models/via-cep';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class ClienteService extends BaseService {
  private viaCEPUrl = 'https://viacep.com.br/ws/';

  constructor(private http: HttpClient) {
    super();
  }

  getEnderecoPorCEP(cep: string): Observable<ViaCEP> {
    return this.http
      .get<ViaCEP>(`${this.viaCEPUrl}${cep}/json/`)
      .pipe(catchError(this.handleServiceError<any>()));
  }
}
