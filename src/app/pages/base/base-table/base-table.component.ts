import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subject } from 'rxjs';
import { AppInjectorService } from 'src/app/services/app-injector.service';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmDialogComponent } from 'src/app/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { MaskConfig } from 'src/app/shared/fields/mask-configs';
import { FormHelper } from 'src/core/helpers/form-helper.model';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export abstract class BaseTableComponent implements OnInit {
  disabledState$: Subject<boolean>;
  dataSource: MatTableDataSource<any>;
  formArray = new FormArray([]);
  deletedData = new Array();
  originalDataSource: any;
  formGroupConfig: any;
  lastAddedItem: FormGroup;
  displayedColumns: string[];

  maskConfig = new MaskConfig();
  cnpjMaskConfig = this.maskConfig.cnpj;
  telefoneMaskConfig = this.maskConfig.telefone9;

  // Services
  toastr: ToastrService;
  dialog: MatDialog;
  fb: FormBuilder;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public tableService: BaseService, public elementRef: ElementRef) {
    this.toastr = AppInjectorService.injector.get(ToastrService);
    this.dialog = AppInjectorService.injector.get(MatDialog);
    this.fb = AppInjectorService.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.select();
    this.formArray.disable();
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }

  select(parent: any = null, sortItems: any = null) {
    if (!!parent) {
      this.tableService.getByParent(parent).subscribe({
        next: (items) => {
          if (!!items) {
            if (!!sortItems) {
              items.sort((a, b) => sortItems(a, b));
            }
            this.setItems(items);
          }
        },
        error: () => this.toastr.error('Um erro ocorreu ao buscar itens.'),
      });
    } else {
      this.tableService.getAll().subscribe({
        next: (items) => {
          if (!!items) {
            if (!!sortItems) {
              items.sort((a, b) => sortItems(a, b));
            }
            this.setItems(items);
          }
        },
        error: () => this.toastr.error('Um erro ocorreu ao buscar itens.'),
      });
    }
  }

  setItems(items: any[] = this.formArray.getRawValue()) {
    this.formArray.clear();
    if (!!items) {
      this.originalDataSource = items;
      items.forEach(() => {
        this.addRow(false);
      });
      this.formArray.patchValue(items);
      this.formArray.markAsPristine();
      this.updateDataSource();
      if (!!this.paginator) {
        this.paginator.firstPage();
      }
    }
    // this.onClear();
  }

  async beforeSave(
    customTableData: any[] = [],
    deletePropertyName: string = 'nome'
  ) {
    if (this.formArray.dirty) {
      if (this.formArray.invalid) {
        this.toastr.error('Existem campos inválidos na tabela.');
        this.formArray.markAllAsTouched(); // para mostrar erros nas linhas
      } else {
        this.setRowsAsModified();
        await this.save(customTableData, deletePropertyName);
      }
    } else {
      this.toastr.error('Nenhum campo foi modificado.');
    }
  }

  async save(customTableData: any[] = [], propertyName: string = 'nome') {
    const data =
      customTableData.length === 0
        ? customTableData
        : this.formArray.getRawValue();
    const errosSalvar = new Array();
    const errosDeletar = new Array();

    const promises = data.map(async (item: any) => {
      if (item.new) {
        await firstValueFrom(this.tableService.post(item))
          .then()
          .catch(() => {
            const index = data.findIndex((x: any) => x === item);
            errosSalvar.push(index);
          });
      } else if (item.modified) {
        await firstValueFrom(this.tableService.put(item))
          .then()
          .catch(() => {
            const index = data.findIndex((x: any) => x === item);
            errosSalvar.push(index);
          });
      }
    });
    if (this.deletedData.length > 0) {
      for (const id of this.deletedData) {
        await firstValueFrom(this.tableService.delete(id))
          .then()
          .catch((e) => {
            this.originalDataSource.forEach((x: any) => {
              // TODO ver caso não tenha ID
              if (x.id === id) {
                errosDeletar.push({
                  nome: x[propertyName],
                  erro: e.error.errors.Id[0],
                });
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
        message += ` e ao deletar: ${errosDeletar.map((x) => ` ${x}`)}`;
      }
      this.toastr.error(message);
    } else if (errosDeletar.length > 0) {
      this.toastr.error(
        `Ocorreram erros ao deletar: ${errosDeletar.map(
          (x) => ` ${x[propertyName]} (${x.erro})`
        )}`
      );
    } else {
      this.toastr.success('Salvo com sucesso.');
      this.disabledState$.next(true);
    }
  }

  async beforeUndo() {
    this.disabledState$.next(true);
    if (this.formArray.dirty) {
      const confirma = await this.openDialog(
        'Confirmar',
        'Deseja descartar alterações?'
      );
      if (confirma) {
        this.undo();
      } else {
        this.disabledState$.next(false);
      }
    } else {
      this.undo();
    }
  }

  edit() {
    this.formArray.enable();
  }

  async undo() {
    this.setItems();
    this.onClear();
  }

  onClear() {
    this.allComplete = false;
    this.deletedData = [];
    this.disabledState$.next(true);
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

    return await firstValueFrom(dialogRef.beforeClosed()).then((e) => e);
  }
  // #endregion

  // #region Configuração dos Campos
  getErrorMessage(control: FormControl) {
    return FormHelper.getErrorMessage(control);
  }

  compareForSelectField(o1: any, o2: any): boolean {
    return o1.id === o2.id;
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
