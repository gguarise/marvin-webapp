import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { Fornecedor } from 'src/app/models/fornecedor';
import { Produto } from 'src/app/models/produto';
import { FornecedorService } from 'src/app/services/fornecedor.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { BaseComponent } from '../base/base.component';
import { FornecedorComponent } from '../fornecedor/fornecedor.component';

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.scss'],
})
export class ProdutoComponent extends BaseComponent {
  displayedColumns: string[] = [
    'select',
    'nome',
    'tipo',
    'descricao',
    'quantidadeEstoque',
    'valorUnitario',
    'valorCobrado',
    'fornecedor',
  ];
  fornecedores$: Observable<Fornecedor[]>;

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService,
    public produtoService: ProdutoService,
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
      tipo: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(50)]),
      ],
      descricao: [null, Validators.maxLength(500)],
      quantidadeEstoque: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0),
          Validators.max(2147483647),
        ]),
      ],
      valorUnitario: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999999.99),
        ]),
      ],
      valorCobrado: [
        null,
        Validators.compose([
          Validators.required,
          Validators.min(0.01),
          Validators.max(9999999999.99),
        ]),
      ],
      fornecedor: [null, Validators.required],
      modified: [],
      new: [],
    };

    fornecedorService.getAll().subscribe((t) => {
      this.fornecedores$ = of(t);
    });
  }

  override select() {
    this.produtoService.getAll().subscribe({
      next: (x) => {
        if (!!x) {
          // Ordenar pelo nome do Produto
          x.sort((a, b) => (a.nome > b.nome ? 1 : b.nome > a.nome ? -1 : 0));
          super.select(x);
        }
      },
      error: (e) => this.toastr.error('Um erro ocorreu ao buscar os produtos'),
    });
  }

  override async save() {
    const data = this.getRawData();
    const errosSalvar = new Array();
    const errosDeletar = new Array();

    const promises = data.map(async (item) => {
      if (item.new) {
        await this.produtoService
          .postProduto(item)
          .toPromise()
          .then()
          .catch((e) => {
            const index = data.findIndex((x) => x === item);
            errosSalvar.push(index);
          });
      } else if (item.modified) {
        await this.produtoService
          .putProduto(item)
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
        await this.produtoService
          .deleteProduto(id)
          .toPromise()
          .then()
          .catch((e) => {
            this.originalDataSource.forEach((x: Produto) => {
              if (x.id === id) {
                errosDeletar.push(x.nome);
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
        message += ` e ao deletar o(s) produto(s): ${errosDeletar.map(
          (x) => ` ${x}`
        )}`;
      }
      this.toastr.error(message);
    } else if (errosDeletar.length > 0) {
      this.toastr.error(
        `Ocorreram erros ao deletar o(s) produto(s): ${errosDeletar.map(
          (x) => x
        )}`
      );
    } else {
      this.toastr.success('Lista de Produtos atualizada com sucesso.');
      super.save();
    }
  }

  getRawData() {
    return this.formArray.getRawValue();
  }

  compareFornecedor(o1: any, o2: any): boolean {
    return o1.name === o2.name && o1.id === o2.id;
  }

  async openFornecedorDialog() {
    const screenSize = window.innerWidth;
    const dialogRef = this.dialog.open(FornecedorComponent, {
      width: screenSize > 599 ? '70%' : '90%',
      height: 'auto',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.fornecedorService.getAll().subscribe((t) => {
        this.fornecedores$ = of(t);
      });
    });
  }
}
