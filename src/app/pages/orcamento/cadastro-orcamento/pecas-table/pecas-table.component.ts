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
import { minValueValidator } from 'src/core/validators/min-value-validator';

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
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PecasTableComponent extends ChildBaseTableComponent {
  @Output() calculateCustoPecas = new EventEmitter();

  constructor(
    elementRef: ElementRef,
    baseService: OrcamentoService // Service de Peça não existe, usa o de orçamento só pra preencher
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
      valorUnitarioCompra: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(99999.99),
        ]),
      ],
      valorUnitarioVenda: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999999.99),
        ]),
      ],
      quantidade: [
        1,
        Validators.compose([
          Validators.required,
          Validators.min(1),
          Validators.max(2147483647),
        ]),
      ],
      percentual: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(10000),
        ]),
      ],
      codigoNCM: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(8)]),
      ],
      valorCobrado: [
        { value: null, disabled: true },
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(9999999999.99),
        ]),
      ],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome',
      'descricao',
      'codigoNCM',
      'valorUnitarioCompra',
      'percentual',
      'valorUnitarioVenda',
      'quantidade',
      'valorCobrado',
    ];
  }

  // Salva no próprio orçamento
  override async save() {}

  override deleteSelectedRows() {
    super.deleteSelectedRows();
    this.calculateCustoPecas.emit();
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoPecas.emit();
  }

  override afterFormEnable() {
    // Pode ser usado pra desabilitar campos após formulário ser habilitado
    this.formArray.controls.forEach((item) => {
      item.get('valorUnitarioVenda')?.disable();
      item.get('valorCobrado')?.disable();
    });
  }

  setValorUnitarioVenda(element: any) {
    const valorUnitarioCompra = element.get('valorUnitarioCompra')?.value;
    if (!!valorUnitarioCompra) {
      const percentual = element.get('percentual')?.value;
      if (!!percentual) {
        element
          .get('valorUnitarioVenda')
          .setValue(
            valorUnitarioCompra * (percentual / 100) + valorUnitarioCompra
          );
      } else {
        element.get('valorUnitarioVenda').setValue(valorUnitarioCompra);
      }
      this.calculateTotalPrice(element);
    }
  }

  calculateTotalPrice(element: any) {
    const quantidade = element.get('quantidade').value;
    const valorUnitario = element.get('valorUnitarioVenda').value;

    element.get('valorCobrado').setValue(valorUnitario * quantidade);
    this.emitCalculateCustoTotalEvent();
  }
}
