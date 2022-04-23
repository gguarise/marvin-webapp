import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Produto } from 'src/app/models/produto';
import { RelatorioOrcamento } from 'src/app/models/relatorio-orcamento';
import { Servico } from 'src/app/models/servico';
import { ProdutoService } from 'src/app/services/produto.service';
import { ServicoService } from 'src/app/services/servico.service';

@Component({
  selector: 'app-relatorio-ordem-servico',
  templateUrl: './relatorio-ordem-servico.component.html',
  styleUrls: ['./relatorio-ordem-servico.component.scss'],
})
export class RelatorioOrdemServicoComponent implements AfterViewInit {
  dataAgora = new Date();
  logo: any;
  listaServicos: Servico[];
  listaProdutos: Produto[];
  numberFormat = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    style: 'currency',
    currency: 'BRL',
  };

  constructor(
    public servicoService: ServicoService,
    public produtoService: ProdutoService,
    public cdr: ChangeDetectorRef,
    @Optional() public dialogRef: MatDialogRef<RelatorioOrdemServicoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public orcamento: RelatorioOrcamento
  ) {}

  async ngAfterViewInit() {
    await this.getLists();
    this.cdr.detectChanges();

    window.print();
    setTimeout(() => {
      this.dialogRef.close();
    }, 0);
  }

  async getLists() {
    await firstValueFrom(this.servicoService.getAll()).then(
      (x) => (this.listaServicos = x)
    );

    await firstValueFrom(this.produtoService.getAll()).then(
      (x) => (this.listaProdutos = x)
    );
  }

  getFormaPagamento() {
    const modo = this.orcamento.pagamento.modoPagamento;
    let texto = 'Forma(s) de Pagamento: ';
    texto += modo.cartaoCredito ? ' Cartão de Crédito |' : '';
    texto += modo.cartaoDebito ? ' Cartão de Débito |' : '';
    texto += modo.dinheiro ? ' Dinheiro |' : '';
    texto += modo.pix ? ' Pix |' : '';

    return texto.substring(0, texto.length - 1); // Retira pipe que sobrou
  }

  // Caso comece a dar erro com listas
  // const p1 = new Promise(
  //   async (resolve) =>
  //     await this.servicoService.getAll().subscribe((x: Servico[]) => {
  //       this.listaServicos = x;
  //       resolve('done');
  //     })
  // );
  // const p2 = new Promise(
  //   async (resolve) =>
  //     await this.produtoService.getAll().subscribe((x: Produto[]) => {
  //       this.listaProdutos = x;
  //       resolve('done');
  //     })
  // );

  // await Promise.all([p1, p2]);
}
