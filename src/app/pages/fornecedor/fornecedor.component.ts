import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
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
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    public fornecedorService: FornecedorService
  ) {
    super(elementRef, fb, cdr);
    this.formGroupConfig = {
      select: [false],
      id: [],
      tel: [],
      nome: [],
      cnpj: [],
      telefone: [],
      email: [],
      tipo: [],
      modified: [],
      new: [],
    };
  }

  override select() {
    this.fornecedorService.getAll().subscribe({
      next: (x) => super.select(x),
      error: (e) => console.error(e),
    });
  }

  override async save() {
    const data = this.formArray.getRawValue();
    let error: string = '';
    await data.forEach(async (item) => {
      if (item.new) {
        await this.fornecedorService.postFornecedor(item).subscribe({
          next: (x) => console.log(x),
          error: (e) => (error = e.error.detail),
        });
      } else if (item.modified) {
        await this.fornecedorService.putFornecedor(item).subscribe({
          next: (x) => console.log(x),
          error: (e) => (error = e.error.detail),
        });
      }
    });
    if (error.length > 0) {
      // mostrar erro
    } else if (this.deletedData.length > 0) {
      await this.deletedData.forEach(async (id) => {
        await this.fornecedorService.deleteFornecedor(id).subscribe({
          next: (x) => console.log(x),
          error: (e) => (error = e.error.detail),
        });
      });
    }
  }
}
