import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { StatusOrcamento } from 'src/app/models/enum/status-orcamento';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';

@Component({
  selector: 'app-agendamento',
  templateUrl: './agendamento.component.html',
  styleUrls: ['./agendamento.component.scss'],
})
export class AgendamentoComponent extends BaseTableComponent {
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
      valorFinal: [],
      dataAgendamento: [],
    };
    this.displayedColumns = [
      'clienteId',
      'carroId',
      'valorFinal',
      'dataAgendamento',
    ];
  }

  override select() {
    // Retorna apenas orçamentos Agendados (Agendamentos)
    const searchParams = { Status: StatusOrcamento.Agendado };
    super.select(null, null, searchParams);
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
    // Ao clicar duas vezes na linha (selecionar Agendamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.router.navigate(['/cadastro-agendamento', id]);
    }
  }
}
