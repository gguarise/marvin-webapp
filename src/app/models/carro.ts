import { BaseModel } from './base';

export class Carro extends BaseModel {
  clienteId: string;
  id: string;
  placa: string;
  descricao: string;
  quilometragem: number;
  modelo: string;
  marca: string;
  ano: number;
  ativo: boolean;
}
