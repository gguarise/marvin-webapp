import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { of } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { BaseService } from 'src/app/services/base.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-servico',
  templateUrl: './servico.component.html',
  styleUrls: ['./servico.component.scss'],
})
export class ServicoComponent extends ChildBaseTableComponent {
  servicos$ = of([
    { id: 1, nome: 'Serviço 1' },
    { id: 2, nome: 'Serviço 2' },
    { id: 3, nome: 'Serviço 3' },
  ]);

  @Output() calculateCustoServicos = new EventEmitter();

  constructor(
    elementRef: ElementRef,
    servicoService: ServicoService
  ) {
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

  emitCalculateCustoTotalEvent() {
    this.calculateCustoServicos.emit();
  }
}
