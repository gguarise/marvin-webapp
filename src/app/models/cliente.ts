import { BaseModel } from './base';
import { Carro } from './carro';

export class Cliente extends BaseModel {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  endereco: string;
  ativo: boolean;
  carros: Carro[];
}
