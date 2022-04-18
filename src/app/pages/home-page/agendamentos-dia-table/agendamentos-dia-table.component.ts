import {
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BaseTableComponent } from 'src/app/components/base/base-table/base-table.component';
import { Carro } from 'src/app/models/carro';
import { Cliente } from 'src/app/models/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { OrcamentoService } from 'src/app/services/orcamento.service';
import { DialogHelper } from 'src/core/helpers/dialog-helper';

@Component({
  selector: 'app-agendamentos-dia-table',
  templateUrl: './agendamentos-dia-table.component.html',
  styleUrls: ['./agendamentos-dia-table.component.scss'],
})
export class AgendamentosDiaTableComponent extends BaseTableComponent {
  clientes: Cliente[] = [];
  carros: Carro[] = [];
  showTable = false;

  @ViewChild('pdfTable') pdfTable: ElementRef;

  constructor(
    public router: Router,
    public orcamentoService: OrcamentoService,
    public clienteService: ClienteService,
    elementRef: ElementRef,
    @Optional() public dialogRef: MatDialogRef<AgendamentosDiaTableComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: Date
  ) {
    super(orcamentoService, elementRef);
    this.formGroupConfig = {
      id: [],
      status: [],
      clienteId: [],
      carroId: [],
      valorFinal: [],
      dataAgendamento: [],
    };
    this.displayedColumns = [
      'clienteId',
      'carroId',
      'valorFinal',
      'dataAgendamento', // TODO hora agendamento
    ];
  }

  override select() {
    const searchParams = {
      DiaAgendamento: this.data.getDate(),
      MesAgendamento: this.data.getMonth() + 1,
      AnoAgendamento: this.data.getFullYear(),
    };
    super.select(null, null, searchParams);
  }

  override setInitialData() {
    super.setInitialData();
    if (this.formArray?.length > 0) {
      this.showTable = true;
    } else {
      this.dialogRef.close();
      this.confirmaNovoAgendamento();
    }
  }

  async confirmaNovoAgendamento() {
    const confirma = await DialogHelper.openDialog(
      'Novo Agendamento',
      'Não existem agendamentos para esta data. Deseja adicionar um novo agendamento?'
    );
    if (confirma) {
      this.router.navigate(['/cadastro-agendamento']); // TODO mudar para conseguir mandar a data de agendamento
    }
  }

  override compare(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  override setItems(items: any[]) {
    super.setItems(items);

    // Preenche lista de Clientes e Carros para select-fields
    this.clienteService.getAll().subscribe((c: Cliente[]) => {
      this.clientes = this.clientes.concat(c);

      c.forEach((cliente: Cliente) => {
        this.carros = this.carros.concat(cliente.carros);
      });
    });
  }

  override handleDoubleClickEvent(data: any) {
    // Ao clicar duas vezes na linha (selecionar Agendamento)
    const id = data.element?.id?.value;

    if (!!id) {
      this.closeDialog();
      this.router.navigate(['/cadastro-agendamento', id]);
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  downloadPdf() {
    const prepare: any = [];
    this.formArray.controls.forEach((e) => {
      const tempObj = [];
      const data = new Date(e.get('dataAgendamento')?.value);

      tempObj.push(this.returnNomeCliente(e.get('clienteId')?.value));
      tempObj.push(this.returnCarro(e.get('carroId')?.value)?.placa);
      tempObj.push(this.returnCarro(e.get('carroId')?.value)?.marca);
      tempObj.push(this.returnCarro(e.get('carroId')?.value)?.modelo);
      tempObj.push(`R$ ${e.get('valorFinal')?.value}`);
      tempObj.push(
        `${data.getHours().toString().padStart(2, '0')}:${data
          .getMinutes()
          .toString()
          .padStart(2, '0')}`
      );
      prepare.push(tempObj);
    });
    const dataString = `${this.data.getDate().toString().padStart(2, '0')}/${(
      this.data.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}/${this.data.getFullYear()}`;

    const doc = new jsPDF();
    doc.text(`Data de Agendamento: ${dataString}`, 14, 10);
    doc.addImage('assets/img/logo.png', 'png', 14, 10, 50, 15);

    autoTable(doc, {
      head: [
        [
          'Cliente',
          'Placa',
          'Marca',
          'Modelo',
          'Valor Final',
          'Hora do Agendamento',
        ],
      ],
      body: prepare,
      headStyles: {
        fillColor: [239, 75, 5],
      },
      alternateRowStyles: { fillColor: [255, 220, 205] },
    });
    doc.save(`Agendamentos ${dataString.replace('/', '-')}` + '.pdf');
  }

  returnNomeCliente(clienteId: any) {
    return this.clientes.find((x) => x.id === clienteId)?.nome;
  }

  returnCarro(carroId: any) {
    return this.carros.find((x) => x.id === carroId);
  }

  // openPDF(): void {
  //   let pdf = new jsPDF();
  //   pdf.html(this.pdfTable.nativeElement, {
  //     callback: (pdf) => {
  //       pdf.save('sample.pdf');
  //     },
  //   });
  // }

  // teste() {
  //   // PARA ABRIR PREVIEW
  //   const printContents = document.getElementById('pdfTable')?.innerHTML;
  //   console.log(printContents);
  //   const popupWin = window.open(
  //     '',
  //     '_blank',
  //     'top=0,left=0,height=auto,width=auto'
  //   );
  //   popupWin?.document.open();
  //   popupWin?.document.write(`
  //     <html>
  //       <head>
  //         <title>Print tab</title>
  //       </head>
  //   <body onload="window.print();window.close()"><table class="table table-bordered">${printContents}</table></body>
  //     </html>`);
  //   popupWin?.document.close();
  // }
}
