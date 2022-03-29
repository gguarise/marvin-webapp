import { Component, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Orcamento } from 'src/app/models/orcamento';
import { OrcamentoService } from 'src/app/services/orcamento.service';

@Component({
  selector: 'app-orcamento',
  templateUrl: './orcamento.component.html',
  styleUrls: ['./orcamento.component.scss'],
})
export class OrcamentoComponent extends BaseTableComponent {
  constructor(
    public router: Router,
    public orcamentoService: OrcamentoService,
    elementRef: ElementRef
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      // TODO modificar
      id: [],
      cliente: [],
      carro: [],
      dataOrcamento: [],
      valor: [],
    };
    this.displayedColumns = ['cliente', 'carro', 'dataOrcamento', 'valor'];
  }

  override select() {
    const sortItems = (a: Orcamento, b: Orcamento) =>
      a.clienteId > b.clienteId ? 1 : b.clienteId > a.clienteId ? -1 : 0;

    super.select(null, sortItems);
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar Orcamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.router.navigate(['/cadastro-orcamento', id]);
    }
  }
}
