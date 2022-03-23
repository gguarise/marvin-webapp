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
  private carroUrl = `${environment.apiUrl.cliente}Carro`;
  private tabelaFipeUrl = 'https://parallelum.com.br/fipe/api/v2/';

  constructor(private http: HttpClient) {
    super();
  }

  searchByPlaca(placa: string): Observable<Carro[]> {
    return this.http
      .get<Carro[]>(`${this.carroUrl}?Placa=${placa}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  searchByModelo(modelo: string): Observable<Carro[]> {
    return this.http
      .get<Carro[]>(`${this.carroUrl}?Modelo=${modelo}`)
      .pipe(catchError(this.handleServiceError<any>()));
  }

  override post(payload: any): Observable<any> {
    return this.http.post(`${this.carroUrl}`, payload).pipe(
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
    return this.http.put(`${this.carroUrl}`, payload).pipe(
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
    return this.http.delete(`${this.carroUrl}/${id}`).pipe(
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
