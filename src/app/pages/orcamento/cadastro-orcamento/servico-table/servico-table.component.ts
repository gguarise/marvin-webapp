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
import { ServicoComponent } from 'src/app/pages/servico/servico.component';
import { ServicoService } from 'src/app/services/servico.service';
import { duplicateTableValueValidator } from 'src/core/validators/duplicate-table-value-validator';

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

  constructor(elementRef: ElementRef, public servicoService: ServicoService) {
    super(servicoService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      servicoId: [
        null,
        Validators.compose([
          Validators.required,
          duplicateTableValueValidator('servicoId', 'Serviço'),
        ]),
      ],
      descricao: [],
      valor: [],
      modified: [],
      new: [],
    };
    this.displayedColumns = ['select', 'servicoId', 'descricao', 'valor'];
  }

  override ngOnInit() {
    this.getServicos();
  }

  // Salva no próprio orçamento
  override async beforeSave() {}

  // override setNewItem() {
  //   super.setNewItem();
  //   this.lastAddedItem.get('orcamentoId')?.setValue(this.parentId);
  // }

  emitCalculateCustoTotalEvent() {
    this.calculateCustoServicos.emit();
  }

  addServico() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(ServicoComponent, {
      data: 'a',
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getServicos();
    });
  }

  getServicos() {
    this.servicoService.getAll().subscribe((s: Servico[]) => {
      this.servicos$ = of(s);
    });
  }
}