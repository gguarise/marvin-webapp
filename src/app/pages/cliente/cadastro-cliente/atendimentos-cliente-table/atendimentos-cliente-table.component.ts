import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Carro } from 'src/app/models/carro';
import { StatusOrcamento } from 'src/app/models/enum/status-orcamento';
import { Orcamento } from 'src/app/models/orcamento';
import { CarroService } from 'src/app/services/carro.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';

@Component({
  selector: 'app-atendimentos-cliente-table',
  templateUrl: './atendimentos-cliente-table.component.html',
  styleUrls: ['./atendimentos-cliente-table.component.scss'],
})
export class AtendimentosClienteTableComponent extends ChildBaseTableComponent {
  numberFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };
  agendamentos: Orcamento[];
  carros: Carro[] = [];

  constructor(
    public orcamentoService: OrcamentoService,
    public carroService: CarroService,
    public cdr: ChangeDetectorRef,
    public router: Router,
    elementRef: ElementRef
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      id: [],
      status: [false],
      carroId: [],
      valorFinal: [],
      dataAgendamento: [],
      dataHoraFim: [],
      pagamento: this.fb.group({
        pagamentoEfetuado: [],
      }),
    };
    this.displayedColumns = [
      'status',
      'carroId',
      'valorFinal',
      'dataAgendamento',
      'dataHoraFim',
      'pagamentoEfetuado',
    ];
  }

  override async ngOnInit() {
    const searchParams = { ClienteId: this.parentId };
    await firstValueFrom(this.orcamentoService.getAll(searchParams)).then(
      (x) => {
        this.agendamentos = x.filter(
          (orcamento) =>
            orcamento.status == StatusOrcamento.Agendado ||
            orcamento.status == StatusOrcamento.Finalizado
        );

        this.setItems(this.agendamentos);
        x.forEach(async (orcamento) => {
          await firstValueFrom(
            this.carroService.getById(orcamento.carroId)
          ).then((c) => {
            this.carros.push(c);
          });
        });
      }
    );
  }

  override handleDoubleClickEvent(linha: any) {
    // O guard vai garantir que nenhuma alteração seja descartada
    const id = linha?.element?.id?.value;
    if (!!id) {
      this.router.navigate(['/cadastro-agendamento', id]);
    }
  }
}
