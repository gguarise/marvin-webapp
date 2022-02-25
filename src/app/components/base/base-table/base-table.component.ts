import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subject } from 'rxjs';
import { AppInjectorService } from 'src/app/services/app-injector.service';
import { BaseService } from 'src/app/services/base.service';
import { ConfirmDialogComponent } from 'src/app/components/shared/dialogs/confirm-dialog/confirm-dialog.component';
import { FormHelper } from 'src/core/helpers/form-helper';
import { DialogHelper } from 'src/core/helpers/dialog-helper';

@Component({
  selector: 'app-base-table',
  templateUrl: './base-table.component.html',
  styleUrls: ['./base-table.component.scss'],
})
export abstract class BaseTableComponent implements OnInit, OnDestroy {
  formEditing$ = new Subject<boolean>(); // Controla des/habilitação da tabela
  dataSource: MatTableDataSource<any>; // DataSource para o mat-table
  formArray = new FormArray([]); // FormArray do Angular Forms
  deletedData = new Array(); // Linhas deletadas da tabela
  originalDataSource: any; // Dados originais (salvos no banco)
  formGroupConfig: any; // O que define os campos e validações em cada tela
  lastAddedItem: FormGroup; // Última linha adicionada na tabela
  displayedColumns: string[]; // Colunas a serem mostradas na tabela
  formHelper = FormHelper; // Funções auxiliares

  // Services
  toastr: ToastrService;
  dialog: MatDialog;
  fb: FormBuilder;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

  constructor(public tableService: BaseService, public elementRef: ElementRef) {
    this.toastr = AppInjectorService.injector.get(ToastrService);
    this.dialog = AppInjectorService.injector.get(MatDialog);
    this.fb = AppInjectorService.injector.get(FormBuilder);

    this.formEditing$.subscribe((isEditing) => {
      isEditing ? this.formArray.enable() : this.formArray.disable();
    });
  }

  ngOnInit() {
    this.select();
    this.formEditing$.next(false);
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

  setItems(items: any[]) {
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
    this.setInitialData();
  }

  async beforeSave(deletePropertyName: string = 'nome') {
    if (this.formArray.dirty) {
      if (this.formArray.invalid) {
        this.toastr.error('Existem campos inválidos na tabela.');
        this.formArray.markAllAsTouched(); // Para mostrar erros nas linhas
      } else {
        this.setRowsAsModified();
        await this.save(deletePropertyName);
      }
    } else {
      this.toastr.error('Nenhum campo foi modificado.');
    }
  }

  async save(propertyNameErrorMessage: string = 'nome') {
    const data = this.getRawData();
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
                  nome: x[propertyNameErrorMessage],
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
          (x) => ` ${x.nome} (${x.erro})`
        )}`
      );
    } else {
      this.toastr.success('Salvo com sucesso.');
      this.setInitialData();
    }
  }

  async beforeUndo() {
    this.formEditing$.next(false);
    if (this.formArray.dirty) {
      const confirma = await DialogHelper.openDialog(
        'Confirmar',
        'Deseja descartar alterações?'
      );
      if (confirma) {
        this.undo();
      } else {
        this.formEditing$.next(true);
      }
    } else {
      this.undo();
    }
  }

  edit() {
    this.formEditing$.next(true);
  }

  async undo() {
    this.select();
    this.onClear();
  }

  onClear() {
    this.setInitialData();
  }

  setInitialData() {
    this.deletedData = [];
    this.formEditing$.next(false);
    this.clearSelections();
  }

  getRawData() {
    return this.formArray.getRawValue();
  }

  // #region Comportamento da Tabela
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

  // #region Dialog de Confirmação
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

  // TODO ver como funciona
  compareForSelectField(o1: any, o2: any): boolean {
    return o1.id === o2.id;
  }
  // #endregion

  // #region Checkbox - Seleção
  clearSelections() {
    this.dataSource?.data.forEach((t) => t.get('select').setValue(false));
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
