import { Component, ElementRef } from '@angular/core';
import { Validators } from '@angular/forms';
import { Fornecedor } from 'src/app/models/fornecedor';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { duplicateTableValueValidator } from 'src/core/validators/duplicate-table-value-validator';
import { FieldValidators } from 'src/core/validators/field-validators';
import { BaseTableComponent } from '../../components/base/base-table/base-table.component';
import { ListaProdutosComponent } from './lista-produtos/lista-produtos.component';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
})
export class FornecedorComponent extends BaseTableComponent {
  constructor(
    public fornecedorService: FornecedorService,
    elementRef: ElementRef
  ) {
    super(fornecedorService, elementRef);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      cnpj: [
        null,
        Validators.compose([
          duplicateTableValueValidator('cnpj', 'CNPJ'),
          FieldValidators.CNPJ,
        ]),
      ],
      telefone: [],
      email: [
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.maxLength(50),
        ]),
      ],
      tipo: [null, Validators.maxLength(10)],
      endereco: [null, Validators.maxLength(150)],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'nome',
      'telefone',
      'email',
      'cnpj',
      'endereco',
      'tipo',
    ];
  }

  override select() {
    const sortItems = (a: Fornecedor, b: Fornecedor) =>
      a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0;
    super.select(null, sortItems);
  }

  override getRawData() {
    const payload = this.formArray.getRawValue();
    payload.map((fornecedor: Fornecedor) => {
      fornecedor.cnpj = fornecedor.cnpj?.replace(/\D/g, '');
      fornecedor.telefone = fornecedor.telefone?.replace(/\D/g, '');
    });
    return payload;
  }

  override handleDoubleClickEvent(data: any) {
    const screenSize = window.innerWidth;
    let fornecedor = new Fornecedor();
    fornecedor.nome = data.element.nome?.value;
    fornecedor.cnpj = data.element.cnpj?.value;
    fornecedor.telefone = data.element.telefone?.value;
    fornecedor.email = data.element.email?.value;

    this.dialog.open(ListaProdutosComponent, {
      data: fornecedor,
      maxWidth: screenSize > 599 ? '80% !important' : '100vw !important', // PEGAR
      maxHeight: screenSize > 599 ? '80% !important' : '100% !important', // PEGAR
      disableClose: false,
    });
  }
}
