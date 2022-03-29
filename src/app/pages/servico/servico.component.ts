import { Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Servico } from 'src/app/models/servico';
import { ServicoService } from 'src/app/services/servico.service';
import { BaseTableComponent } from '../../components/base/base-table/base-table.component';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent extends BaseTableComponent {
  constructor(public servicoService: ServicoService, elementRef: ElementRef) {
    super(servicoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(100)]),
      ],
      modified: [],
      new: [],
    };
    this.displayedColumns = ['select', 'nome'];
  }

  override select() {
    const sortItems = (a: Servico, b: Servico) =>
      a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
    super.select(null, sortItems);
  }
}
