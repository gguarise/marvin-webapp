import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { OrcamentoService } from 'src/app/services/orcamento.service';

@Component({
  selector: 'app-pecas-table',
  templateUrl: './pecas-table.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PecasTableComponent),
      multi: true,
    },
  ],
  styleUrls: ['./pecas-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PecasTableComponent extends ChildBaseTableComponent {
  @Output() calculateCustoPecas = new EventEmitter();

  constructor(
    elementRef: ElementRef,
    baseService: OrcamentoService // TODO MUDAR
  ) {
    super(baseService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      descricao: [null, Validators.maxLength(150)],
      valorUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999999999999999999999.99),
        ]),
      ],
      valorCobrado: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999999999999999999999.99),
        ]),
      ],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome',
      'descricao',
      'valorUnitario',
      'valorCobrado',
    ];
  }

  // override setNewItem() {
  //   super.setNewItem();
  //   this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  // }

  // Salva no próprio orçamento
  override async beforeSave() {}

  emitCalculateCustoTotalEvent() {
    this.calculateCustoPecas.emit();
  }
}
