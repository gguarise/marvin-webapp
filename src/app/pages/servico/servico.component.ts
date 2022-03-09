import { Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Fornecedor } from 'src/app/models/fornecedor';
import { ServicoService } from 'src/app/services/servico.service';
import { CNPJValidator } from 'src/core/validators/cnpj-validator';
import { BaseTableComponent } from '../../components/base/base-table/base-table.component';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss']
})
export class ServicoComponent extends BaseTableComponent {
  constructor(
    public servicoService: ServicoService,
    elementRef: ElementRef
  ) {
    super(servicoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]), // TODO ver max
      ],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome'
    ];
  }

  override select() {
    const sortItems = (a: Fornecedor, b: Fornecedor) =>
      a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
    // super.select(null, sortItems);

    super.setItems([
      { id: '1', nome: 'Teste Serviço' },
      { id: '2', nome: 'Teste Serviço 2' },
      { id: '3', nome: 'Teste Serviço 3' },
    ])
  }
}
