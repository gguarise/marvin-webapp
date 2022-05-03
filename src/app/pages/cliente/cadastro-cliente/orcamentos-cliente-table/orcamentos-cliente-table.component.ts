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
  selector: 'app-orcamentos-cliente-table',
  templateUrl: './orcamentos-cliente-table.component.html',
  styleUrls: ['./orcamentos-cliente-table.component.scss'],
})
export class OrcamentosClienteTableComponent extends ChildBaseTableComponent {
  numberFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };
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
      dataCadastro: [],
    };
    this.displayedColumns = ['status', 'carroId', 'valorFinal', 'dataCadastro'];
  }

  override async ngOnInit() {
    const searchParams = {
      ClienteId: this.parentId,
      Status: StatusOrcamento.Cadastrado,
    };
    await firstValueFrom(this.orcamentoService.getAll(searchParams)).then(
      (x) => {
        this.setItems(x);
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
      this.router.navigate(['/cadastro-orcamento', id]);
    }
  }
}
