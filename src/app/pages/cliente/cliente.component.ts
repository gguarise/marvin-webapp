import { Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent extends BaseTableComponent {
  constructor(
    public router: Router,
    public clienteService: ClienteService,
    elementRef: ElementRef
  ) {
    super(clienteService, elementRef);
    this.formGroupConfig = {
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      cpf: [],
      telefone: [],
    };
    this.displayedColumns = ['nome', 'cpf', 'telefone'];
  }

  override select() {
    const sortItems = (a: Cliente, b: Cliente) =>
      a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;

    // Retorna apenas clientes ativos
    const searchParams = { Ativo: 'true' };
    super.select(null, sortItems, searchParams);
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar cliente)
    const id = data.element?.id?.value;

    if (!!id) {
      this.router.navigate(['/cadastro-cliente', id]);
    }
  }
}
