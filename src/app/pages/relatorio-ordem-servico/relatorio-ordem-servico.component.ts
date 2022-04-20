import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Orcamento } from 'src/app/models/orcamento';

@Component({
  selector: 'app-relatorio-ordem-servico',
  templateUrl: './relatorio-ordem-servico.component.html',
  styleUrls: ['./relatorio-ordem-servico.component.scss'],
})
export class RelatorioOrdemServicoComponent implements AfterViewInit {
  dataAgora = new Date();

  constructor(
    @Optional() public dialogRef: MatDialogRef<RelatorioOrdemServicoComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public orcamento: Orcamento
  ) {}

  ngAfterViewInit() {
    window.print();
    this.dialogRef.close();
  }
}
