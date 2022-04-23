import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  token = '';
  expirationTime = 10 * 60000; // 10 minutos para milissegundos
}
