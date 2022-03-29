import { Component, ElementRef, EventEmitter, Output } from '@angular/core';
import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-servico-table',
  templateUrl: './servico-table.component.html',
  styleUrls: ['./servico-table.component.scss'],
})
export class ServicoTableComponent extends ChildBaseTableComponent {
  servicos$ = of([
    { id: 1, nome: 'Serviço 1' },
    { id: 2, nome: 'Serviço 2' },
    { id: 3, nome: 'Serviço 3' },
  ]);

  @Output() calculateCustoServicos = new EventEmitter();

  constructor(elementRef: ElementRef, servicoService: ServicoService) {
    super(servicoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      descricao: [],
      honorario: [],
      modified: [],
      new: [],
    };
    this.displayedColumns = ['select', 'nome', 'descricao', 'honorario'];
  }

  override setNewItem() {
    super.setNewItem();
    this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoServicos.emit();
  }
}
