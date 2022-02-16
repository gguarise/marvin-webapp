import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-pecas-table',
  templateUrl: './pecas-table.component.html',
  styleUrls: ['./pecas-table.component.scss'],
})
export class PecasTableComponent extends BaseComponent {
  displayedColumns: string[] = [
    'select',
    'nome',
    'descricao',
    'valorUnitario',
    'valorCobrado',
  ];

  @Output() calculateCustoPecas = new EventEmitter();

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService
  ) {
    super(dialog, elementRef, fb, toastr, cdr);
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
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoPecas.emit();
  }
}
