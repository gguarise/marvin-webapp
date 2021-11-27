import { Observable } from 'rxjs';

export abstract class BaseService {
  constructor() {}

  protected handleServiceError<T>() {
    return (error: any): Observable<T> => {
      throw error;
    };
  }
}
