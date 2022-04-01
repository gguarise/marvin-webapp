import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Servico } from 'src/app/models/servico';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-servico-table',
  templateUrl: './servico-table.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ServicoTableComponent),
      multi: true,
    },
  ],
  styleUrls: ['./servico-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServicoTableComponent extends ChildBaseTableComponent {
  servicos$: Observable<Servico[]>;

  @Output() calculateCustoServicos = new EventEmitter();

  constructor(elementRef: ElementRef, servicoService: ServicoService) {
    super(servicoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      servicoId: [null, Validators.required],
      descricao: [],
      valor: [],
      modified: [],
      new: [],
    };
    this.displayedColumns = ['select', 'servicoId', 'descricao', 'valor'];
    servicoService.getAll().subscribe((s: any) => {
      this.servicos$ = of(s);
    });
  }

  override setNewItem() {
    super.setNewItem();
    this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoServicos.emit();
  }
}
