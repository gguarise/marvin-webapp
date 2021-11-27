import { Component, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
})
export class FornecedorComponent extends BaseComponent {
  // form: FormGroup = new FormGroup({
  //   select: new FormControl(false),
  //   tel: new FormControl(),
  //   nome: new FormControl(),
  //   cnpj: new FormControl(),
  //   telefone: new FormControl(),
  //   email: new FormControl(),
  //   tipo: new FormControl(),
  // });

  displayedColumns: string[] = [
    'select',
    'nome',
    'cnpj',
    'telefone',
    'email',
    'tipo',
  ];

  constructor(
    elementRef: ElementRef,
    public fornecedorService: FornecedorService
  ) {
    super(elementRef);
  }

  override select() {
    this.fornecedorService.getAll().subscribe({
      next: (x) => super.select(x),
      error: (e) => console.error(e),
    });
  }
}
