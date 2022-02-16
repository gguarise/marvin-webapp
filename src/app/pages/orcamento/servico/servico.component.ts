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
import { of } from 'rxjs';
import { BaseComponent } from '../../base/base.component';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent extends BaseComponent {
  displayedColumns: string[] = ['select', 'nome', 'descricao', 'honorario'];
  servicos$ = of([
    { id: 1, nome: 'Serviço 1' },
    { id: 2, nome: 'Serviço 2' },
    { id: 3, nome: 'Serviço 3' },
  ]);

  @Output() calculateCustoServicos = new EventEmitter();

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
      descricao: [],
      honorario: [],
      modified: [],
      new: [],
    };
  }

  compare(o1: any, o2: any): boolean {
    return o1.nome === o2.nome && o1.id === o2.id;
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoServicos.emit();
  }
}
