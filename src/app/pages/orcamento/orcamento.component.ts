import { Component, ElementRef, Inject, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    public carroService: CarroService,
    elementRef: ElementRef,
    // Ambos abaixo para controlar o comportamento para Tela de Agendamento > Selecionar Orçamento
    @Optional() public dialogRef: MatDialogRef<OrcamentoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public isDialogComponent: boolean
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      id: [],
      status: [],
      clienteId: [],
      carroId: [],
      valorFinal: [],
      dataCadastro: [],
    };
    this.displayedColumns = [
      'status',
      'clienteId',
      'carroId',
      'valorFinal',
      'dataCadastro',
    ];
  }

  // A tabela terá orçamentos Cadastrados e Agendados
  // Orçamentos Finalizados apenas na Tela de Agendamentos
  override select() {
    let tableItems: Orcamento[] = [];
    // Retorna orçamentos apenas Cadastrados
    let searchParams = { Status: StatusOrcamento.Cadastrado };
    this.orcamentoService.getAll(searchParams).subscribe({
      next: (items: Orcamento[]) => {
        if (!!items) {
          tableItems = items;
        }
        // Retorna orçamentos Agendados se não for o dialog
        if (!this.isDialogComponent) {
          searchParams = { Status: StatusOrcamento.Agendado };
          this.orcamentoService.getAll(searchParams).subscribe({
            next: (items: Orcamento[]) => {
              if (!!items) {
                tableItems = tableItems.concat(items);
              }
              this.setItems(tableItems);
            },
            error: () =>
              this.toastr.error('Um erro ocorreu ao buscar os orçamentos.'),
          });
        } else {
          if (tableItems.length === 0) {
            this.toastr.error(
              'Nenhum orçamento com status "Cadastrado" foi encontrado.'
            );
            this.dialogRef.close();
          } else {
            this.setItems(tableItems);
          }
        }
      },
      error: () =>
        this.toastr.error('Um erro ocorreu ao buscar os orçamentos.'),
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
    // Ao clicar duas vezes na linha (selecionar Orcamento)
    const id = data.element?.id?.value;

    if (this.isDialogComponent) {
      // Manda id de volta para a Tela de Agendamento
      this.dialogRef.close(id);
    } else if (!!id) {
      // Visualizar/Editar Orçamento
      this.router.navigate(['/cadastro-orcamento', id]);
    }
  }
}
