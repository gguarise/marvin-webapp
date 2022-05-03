import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Carro } from '../models/carro';
import { TabelaFipe } from '../models/tabela-fipe';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class CarroService extends BaseService {
  private carroUrl = `${environment.safeApiUrl.cliente}carro`;
  private tabelaFipeUrl = 'https://parallelum.com.br/fipe/api/v2/';

  constructor(private http: HttpClient) {
    super();
  }

  // searchParams: Placa | Modelo
  override getAll(searchParams: any = null): Observable<Carro[]> {
    return this.http
      .get<Carro[]>(
        `${this.carroUrl}${this.getSearchString(searchParams)}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override getById(id: any): Observable<Carro> {
    return this.http
      .get<Carro>(`${this.carroUrl}/${id}`, this.getAuthenticationHeaders())
      .pipe(catchError(this.handleServiceError<any>()));
  }

  searchByPlaca(placa: string): Observable<Carro[]> {
    return this.http
      .get<Carro[]>(
        `${this.carroUrl}?Placa=${placa}`,
        this.getAuthenticationHeaders()
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http
      .post(`${this.carroUrl}`, payload, this.getAuthenticationHeaders())
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
      .put(`${this.carroUrl}`, payload, this.getAuthenticationHeaders())
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

  deleteByIdCliente(id: string, idCliente: string): Observable<any> {
    return this.http
      .delete(
        `${this.carroUrl}/${id}/${idCliente}`,
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

  getCarBrands(): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(`${this.tabelaFipeUrl}cars/brands`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  getMotorcycleBrands(): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(`${this.tabelaFipeUrl}motorcycles/brands`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  getTruckBrands(): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(`${this.tabelaFipeUrl}trucks/brands`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  getCarModels(brandId: any): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(`${this.tabelaFipeUrl}cars/brands/${brandId}/models`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  getMotorcycleModels(brandId: any): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(
        `${this.tabelaFipeUrl}motorcycles/brands/${brandId}/models`
      )
      .pipe(catchError(this.handleServiceError<any>()));
  }

  getTruckModels(brandId: any): Observable<TabelaFipe[]> {
    return this.http
      .get<TabelaFipe[]>(`${this.tabelaFipeUrl}trucks/brands/${brandId}/models`)
      .pipe(catchError(this.handleServiceError<any>()));
  }
}
