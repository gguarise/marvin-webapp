import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.scss'],
})
export class OrcamentoComponent extends BaseTableComponent {
  clientes: Cliente[] = [];
  carros: Carro[] = [];

  constructor(
    public router: Router,
    public orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    elementRef: ElementRef
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      id: [],
      clienteId: [],
      carroId: [],
      valorFinal: [], // TODO vai mudar na API
      dataCadastro: [],
    };
    this.displayedColumns = ['clienteId', 'carroId', 'dataCadastro'];
  }

  override compare(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  override setItems(items: any[]) {
    super.setItems(items);

    // Preenche lista de Clientes e Carros para select-fields
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = this.clientes.concat(c);

      c.forEach((cliente: Cliente) => {
        this.carros = this.carros.concat(cliente.carros);
      });
    });
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar Orcamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.router.navigate(['/cadastro-orcamento', id]);
    }
  }
}
