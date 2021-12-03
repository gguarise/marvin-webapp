import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Fornecedor } from 'src/app/models/fornecedor';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { CNPJValidator } from 'src/core/validators/cnpj-validator';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
})
export class FornecedorComponent extends BaseComponent {
  displayedColumns: string[] = [
    'select',
    'nome',
    'telefone',
    'email',
    'cnpj',
    'endereco',
    'tipo',
  ];

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService,
    public fornecedorService: FornecedorService
  ) {
    super(dialog, elementRef, fb, toastr, cdr);
    this.formGroupConfig = {
      select: [false],
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      cnpj: [null, CNPJValidator],
      telefone: [],
      email: [
        null,
        Validators.compose([Validators.email, Validators.maxLength(50)]),
      ],
      tipo: [null, Validators.maxLength(10)],
      endereco: [null, Validators.maxLength(150)],
      modified: [],
      new: [],
    };
  }

  override select() {
    this.fornecedorService.getAll().subscribe({
      next: (x) => {
        if (!!x) {
          // Ordenar pelo nome do Fornecedor
          x.sort((a, b) => (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0));
          super.select(x);
        }
      },
      error: (e) =>
        this.toastr.error('Um erro ocorreu ao buscar os fornecedores'),
    });
  }

  override async save() {
    const data = this.getRawData();
    const errosSalvar = new Array();
    const errosDeletar = new Array();

    const promises = data.map(async (item) => {
      if (item.new) {
        await this.fornecedorService
          .postFornecedor(item)
          .toPromise()
          .then()
          .catch((e) => {
            const index = data.findIndex((x) => x === item);
            errosSalvar.push(index);
          });
      } else if (item.modified) {
        await this.fornecedorService
          .putFornecedor(item)
          .toPromise()
          .then()
          .catch((e) => {
            const index = data.findIndex((x) => x === item);
            errosSalvar.push(index);
          });
      }
    });

    if (this.deletedData.length > 0) {
      for (const id of this.deletedData) {
        await this.fornecedorService
          .deleteFornecedor(id)
          .toPromise()
          .then()
          .catch((e) => {
            this.originalDataSource.forEach((x: Fornecedor) => {
              if (x.id === id) {
                errosDeletar.push({ nome: x.nome, erro: e.error.errors.Id[0] });
              }
            });
          });
      }
    }

    await Promise.all(promises);

    if (errosSalvar.length > 0) {
      let message = `Ocorreram erros ao salvar a(s) linha(s): ${errosSalvar.map(
        (x) => ` ${++x}`
      )}`;
      if (errosDeletar.length > 0) {
        debugger;
        message += ` e ao deletar o(s) fornecedor(es): ${errosDeletar.map(
          (x) => ` ${x}`
        )}`;
      }
      this.toastr.error(message);
    } else if (errosDeletar.length > 0) {
      this.toastr.error(
        `Ocorreram erros ao deletar o(s) fornecedor(es): ${errosDeletar.map(
          (x) => ` ${x.nome} (${x.erro})`
        )}`
      );
    } else {
      this.toastr.success('Lista de Fornecedores atualizada com sucesso.');
      super.save();
    }
  }

  getRawData() {
    const payload = this.formArray.getRawValue();
    payload.map((fornecedor: Fornecedor) => {
      fornecedor.cnpj = fornecedor.cnpj?.replace(/\D/g, '');
      fornecedor.telefone = fornecedor.telefone?.replace(/\D/g, '');
    });
    return payload;
  }
}
