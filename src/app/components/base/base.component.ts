import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/components/shared/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  dataSource: MatTableDataSource<any>;
  formArray = new FormArray([]);
  deletedData = new Array();
  originalDataSource: any;
  formGroupConfig: any;
  lastAddedItem: FormGroup;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public elementRef: ElementRef,
    public fb: FormBuilder,
    public toastr: ToastrService,
    protected cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.select();
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }

  select(data: any = null) {
    if (!!data) {
    }
  }

  edit() {
    this.formArray.enable();
  }

  async beforeSave() {
    if (this.formArray.dirty) {
      if (this.formArray.invalid) {
        this.toastr.error('Existem campos inválidos na tabela.');
        this.formArray.markAllAsTouched(); // para mostrar erros nas linhas
      } else {
        await this.save();
      }
    } else {
      this.toastr.error('Nenhum campo foi modificado.');
    }
  }

  async save() {
    await this.select();
    this.onClear();
  }

  async beforeUndo() {
    if (this.formArray.dirty) {
      const confirma = await this.openDialog(
        'Confirmar',
        'Deseja descartar alterações?'
      );
      if (confirma) {
        this.undo();
      }
    } else {
      this.undo();
    }
  }

  async undo() {
    this.onClear();
  }

  onClear() {
    this.formArray.disable();
    this.deletedData = [];
  }

  // #region Dialog confirmação
  async openDialog(title: string, content: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '250px',
      data: {
        title,
        content,
      },
    });

    return await dialogRef
      .afterClosed()
      .toPromise()
      .then((e) => e);
  }
  // #endregion
}
