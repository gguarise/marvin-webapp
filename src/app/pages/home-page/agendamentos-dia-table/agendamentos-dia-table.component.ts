import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs/internal/firstValueFrom';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { StatusOrcamento } from 'src/app/models/enum/status-orcamento';
import { AtendimentoService } from 'src/app/services/atendimento.service';
import { CarroService } from 'src/app/services/carro.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { DialogHelper } from 'src/core/helpers/dialog-helper';

@Component({
  selector: 'app-agendamentos-dia-table',
  templateUrl: './agendamentos-dia-table.component.html',
  styleUrls: ['./agendamentos-dia-table.component.scss'],
})
export class AgendamentosDiaTableComponent extends BaseTableComponent {
  clientes: Cliente[] = [];
  carros: Carro[] = [];
  showTable = false;
  showReport = false;
  agendamentosRelatorio: any[] = [];
  dataAgora: Date;
  // Formatação relatório
  numberFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };

  constructor(
    public router: Router,
    public orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    public carroService: CarroService,
    public atendimentoService: AtendimentoService,
    public cdr: ChangeDetectorRef,
    elementRef: ElementRef,
    @Optional() public dialogRef: MatDialogRef<AgendamentosDiaTableComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Date
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
      'icone',
    ];
  }

  override ngOnInit() {
    super.ngOnInit();

    // Preenche lista de Clientes
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = c;
    });

    // Preenche lista de Carros
    this.carroService.getAll().subscribe((c: Carro[]) => {
      this.carros = c;
    });
  }

  override select() {
    const searchParams = {
      DiaAgendamento: this.data.getDate(),
      MesAgendamento: this.data.getMonth() + 1,
      AnoAgendamento: this.data.getFullYear(),
    };
    super.select(null, null, searchParams);
  }

  override setInitialData() {
    super.setInitialData();
    if (this.formArray?.length > 0) {
      this.showTable = true;
    } else {
      this.dialogRef.close();
      this.confirmaNovoAgendamento();
    }
  }

  async confirmaNovoAgendamento() {
    const confirma = await DialogHelper.openDialog(
      'Novo Agendamento',
      'Não existem agendamentos para esta data. Deseja adicionar um novo agendamento?'
    );
    if (confirma) {
      this.router.navigate(['/cadastro-agendamento']);
    }
  }

  override compare(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar Agendamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.closeDialog();
      this.router.navigate(['/cadastro-agendamento', id]);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async finalizeAgendamento(element: any) {
    const confirma = await DialogHelper.openDialog(
      'Confirmação',
      'Deseja finalizar o agendamento?'
    );
    if (confirma) {
      const id = element.get('id')?.value;
      await firstValueFrom(this.atendimentoService.putFinalizar({ id }))
        .then(() => {
          this.toastr.success('Agendamento finalizado com sucesso.');
          this.select();
        })
        .catch((e) => {
          if (!!e?.error?.errors) {
            const erros = Object.values(e.error.errors) as Array<any>;
            for (const value of erros) {
              this.toastr.error(value[0]);
            }
          } else {
            this.toastr.error('Não foi possível finalizar o agendamento.');
          }
        });
    }
  }

  returnNomeCliente(clienteId: any) {
    return this.clientes.find((x) => x.id === clienteId)?.nome;
  }

  returnCarro(carroId: any) {
    return this.carros.find((x) => x.id === carroId);
  }

  async imprimir() {
    this.agendamentosRelatorio = this.formArray.getRawValue();
    this.agendamentosRelatorio = this.agendamentosRelatorio.filter(
      (x) => x.status === StatusOrcamento.Finalizado
    );
    if (this.agendamentosRelatorio.length > 0) {
      this.dataAgora = new Date();
      this.showTable = false;
      this.showReport = true;
      await this.cdr.detectChanges();

      window.print();

      this.showTable = true;
      this.showReport = false;
      await this.cdr.detectChanges();
    } else {
      this.toastr.error('Esta data não possui nenhum agendamento finalizado.');
    }
  }
}
