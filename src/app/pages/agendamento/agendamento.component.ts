import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { StatusOrcamento } from 'src/app/models/enum/status-orcamento';
import { Orcamento } from 'src/app/models/orcamento';
import { CarroService } from 'src/app/services/carro.service';
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
    public carroService: CarroService,
    elementRef: ElementRef
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      id: [],
      status: [],
      clienteId: [],
      carroId: [],
      valorFinal: [],
      dataAgendamento: [],
    };
    this.displayedColumns = [
      'status',
      'clienteId',
      'carroId',
      'valorFinal',
      'dataAgendamento',
    ];
  }

  // A tabela terá orçamentos Agendados e Finalizados
  override select() {
    let tableItems: Orcamento[] = [];
    // Retorna orçamentos Agendados
    let searchParams = { Status: StatusOrcamento.Agendado };
    this.orcamentoService.getAll(searchParams).subscribe({
      next: (items: Orcamento[]) => {
        if (!!items) {
          tableItems = items;
        }
        // Retorna orçamentos Finalizados
        searchParams = { Status: StatusOrcamento.Finalizado };
        this.orcamentoService.getAll(searchParams).subscribe({
          next: (items: Orcamento[]) => {
            if (!!items) {
              tableItems = tableItems.concat(items);
            }
            this.setItems(tableItems);
          },
          error: () =>
            this.toastr.error('Um erro ocorreu ao buscar os agendamentos.'),
        });
      },
      error: () =>
        this.toastr.error('Um erro ocorreu ao buscar os agendamentos.'),
    });
  }

  override compare(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  override setItems(items: any[]) {
    super.setItems(items);

    // Preenche lista de Clientes
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c;
    });

    // Preenche lista de Carros
    this.carroService.getAll().subscribe((c: Carro[]) => {
      this.carros = c;
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
