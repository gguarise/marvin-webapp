import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  Optional,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Fornecedor } from 'src/app/models/fornecedor';
import { DialogHelper } from 'src/core/helpers/dialog-helper';
import { FormHelper } from 'src/core/helpers/form-helper';

@Component({
  selector: 'app-lista-produtos',
  templateUrl: './lista-produtos.component.html',
  styleUrls: ['./lista-produtos.component.scss'],
})
export class ListaProdutosComponent implements AfterViewInit {
  mainForm: FormGroup;
  formHelper = FormHelper;
  numbers: Array<number>; // para iterar os produtos

  constructor(
    fb: FormBuilder,
    public toastr: ToastrService,
    protected cdr: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<ListaProdutosComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public fornecedor: Fornecedor
  ) {
    this.mainForm = fb.group({
      nome: [],
      telefone: [],
      cnpj: [],
      email: [],
      textoEmail: [],
    });
    this.numbers = Array(13)
      .fill(0)
      .map((x, i) => i);
  }

  ngAfterViewInit() {
    this.mainForm.get('nome')?.setValue(this.fornecedor.nome);
    this.mainForm.get('telefone')?.setValue(this.fornecedor.telefone);
    this.mainForm.get('cnpj')?.setValue(this.fornecedor.cnpj);
    this.mainForm.get('email')?.setValue(this.fornecedor.email);

    this.mainForm.get('nome')?.disable();
    this.mainForm.get('telefone')?.disable();
    this.mainForm.get('cnpj')?.disable();
    this.mainForm.get('email')?.disable();
    this.cdr.detectChanges();
  }

  async contataFornecedor() {
    const textoEmail = this.mainForm.get('textoEmail')?.value;
    if (!!textoEmail && textoEmail.length > 0) {
      const confirma = await DialogHelper.openDialog(
        'Confirmar',
        'Deseja enviar o e-mail?'
      );
      if (confirma) {
        this.toastr.success(
          `O e-mail para "${this.fornecedor.nome}" foi enviado com sucesso.`
        );
        this.fechaDialog();
      }
    } else {
      this.toastr.error(`O texto para o e-mail não pode estar vazio.`);
    }
  }

  fechaDialog() {
    this.dialogRef.close();
  }
}
