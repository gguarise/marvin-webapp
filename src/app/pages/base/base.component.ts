import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MaskConfig } from 'src/app/shared/fields/mask-configs';

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
      this.setItems(data);
    }
  }

  setItems(items: any[]) {
    this.formArray.clear();
    if (!!items) {
      this.originalDataSource = items;
      items.forEach((x) => {
        this.addRow(false);
      });
      this.formArray.patchValue(items);
      this.formArray.markAsPristine();
      this.updateDataSource();
      if (!!this.paginator) {
        this.paginator.firstPage();
      }
    }
    this.onClear();
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
        this.setRowsAsModified();
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
    this.setItems(this.originalDataSource);
    this.onClear();
  }

  onClear() {
    this.allComplete = false;
    this.formArray.disable();
    this.deletedData = [];
  }

  // #region Auxiliares
  addRow(newItem: boolean = true) {
    this.lastAddedItem = this.fb.group(
      Object.assign({}, cloneDeep(this.formGroupConfig))
    );
    if (newItem) {
      if (!!this.paginator) {
        this.paginator.length = this.paginator.length + 1;
        this.paginator.lastPage();
      }
      this.lastAddedItem.get('new')?.setValue(true);
    }
    this.formArray.push(this.lastAddedItem);
    this.updateDataSource();
  }

  setRowsAsModified() {
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((x) => {
        (x as FormGroup).controls['modified']?.setValue(x.dirty);
      });
    }
  }

  updateDataSource() {
    this.dataSource = new MatTableDataSource(this.formArray.controls);
    if (!!this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
  // #endregion

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

  // #region Configuração dos Campos
  maskConfig = new MaskConfig();
  cnpjMaskConfig = this.maskConfig.cnpj;
  telefoneMaskConfig = this.maskConfig.telefone9;

  // getMask(type: string): any {
  //   let mask = '';
  //   switch (type) {
  //     case 'decimal':
  //       mask = createNumberMask(this.maskConfig.decimal);
  //       break;
  //     default:
  //       mask = createNumberMask(this.maskConfig.inteiro);
  //   }
  //   return mask;
  // }

  getErrorMessage(control: FormControl | AbstractControl | null) {
    if (control) {
      if (control.hasError('email')) {
        return 'Email inválido.';
      } else if (control.hasError('minlength')) {
        return `Tamanho mínimo de ${
          control.getError('minlength').requiredLength
        } caracter${
          control.getError('minlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('maxlength')) {
        return `Tamanho máximo de ${
          control.getError('maxlength').requiredLength
        } caracter${
          control.getError('maxlength').requiredLength > 1 ? 'es' : ''
        }.`;
      } else if (control.hasError('min')) {
        if (control.getError('min').min === 0) {
          return `Valor não pode ser negativo.`;
        } else {
          return `Valor mínimo de ${control.getError('min').min}.`;
        }
      } else if (control.hasError('max')) {
        return `Valor máximo de ${control.getError('max').max}.`;
      } else if (control.hasError('custom')) {
        return control.getError('custom').message;
      } else if (control.hasError('required')) {
        return 'Campo obrigatório.';
      } else {
        return '';
      }
    } else {
      return '';
    }
  }
  // #endregion

  // #region Checkbox - Seleção
  allComplete: boolean = false;

  updateAllComplete() {
    this.allComplete = this.dataSource?.data.every(
      (t) => t.get('select').value
    );
  }

  someComplete(): boolean {
    return (
      this.dataSource?.data.filter((t) => t.get('select').value).length > 0 &&
      !this.allComplete
    );
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    this.dataSource?.data.forEach((t) => t.get('select').setValue(completed));
  }

  deleteSelectedRows() {
    const selectedItems = this.dataSource?.data.filter(
      (item) => item.get('select')?.value
    );

    if (selectedItems.length > 0) {
      selectedItems.forEach((item: any) => {
        if (!!item.get('id')?.value) {
          this.deletedData.push(item.get('id').value);
        }
        const index = this.dataSource?.data.findIndex((x) => x === item);
        this.formArray.removeAt(index);
        this.updateDataSource();
      });
    } else {
      this.toastr.warning(
        'É preciso selecionar ao menos um registro para remoção.'
      );
    }
  }
  // #endregion
}
