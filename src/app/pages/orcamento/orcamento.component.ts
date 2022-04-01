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
      id: [], // c0ea60dd-3136-455d-b816-96615c0ec03b
      clienteId: [],
      carroId: [],
      dataOrcamento: [], // TODO faltou na API
      // pagamento: [],
    };
    this.displayedColumns = [
      'clienteId',
      'carroId',
      'dataOrcamento',
      // 'pagamento',
    ];
  }

  override select() {
    // const sortItems = (a: Orcamento, b: Orcamento) =>
    //   a.clienteId > b.clienteId ? 1 : b.clienteId > a.clienteId ? -1 : 0;

    super.select();
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar Orcamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.router.navigate(['/cadastro-orcamento', id]);
    }
  }
}
