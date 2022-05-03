import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subject } from 'rxjs';
import { AppInjectorService } from 'src/app/services/app-injector.service';
import { BaseService } from 'src/app/services/base.service';
import { DialogHelper } from 'src/core/helpers/dialog-helper';
import { FormHelper } from 'src/core/helpers/form-helper';
import { ChildBaseTableComponent } from './child-base-table/child-base-table.component';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  formEditing$ = new Subject<boolean>(); // Controla des/habilitação da tela
  originalData: any;
  routeId: any;
  formHelper = FormHelper;
  mainForm: FormGroup;
  isNewRecord: boolean = false;
  saveTablesIndividually: boolean = true;
  componentTables: ChildBaseTableComponent[];
  isUndoing: boolean = false;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatTabGroup, { static: false }) tabGroup: MatTabGroup;

  // Services
  dialog: MatDialog;
  fb: FormBuilder;
  toastr: ToastrService;

  constructor(
    public baseService: BaseService,
    public elementRef: ElementRef,
    protected cdr: ChangeDetectorRef,
    public route: ActivatedRoute
  ) {
    this.dialog = AppInjectorService.injector.get(MatDialog);
    this.fb = AppInjectorService.injector.get(FormBuilder);
    this.toastr = AppInjectorService.injector.get(ToastrService);

    this.formEditing$.subscribe((isEditing) => {
      isEditing ? this.mainForm.enable() : this.mainForm.disable();
      isEditing ? this.afterFormEnable() : null;
      this.isUndoing = false;
      this.componentTables?.forEach((table) => {
        isEditing ? table.formArray.enable() : table.formArray.disable();
        isEditing ? table.afterFormEnable() : null;
      });
    });
  }

  async ngOnInit(id: any = null) {
    this.routeId = this.route.snapshot.paramMap.get('id');
    if (!!id) {
      // id existirá quando for para visualizar em um dialog
      this.routeId = id;
    }
    if (!this.routeId) {
      this.isNewRecord = true;
    } else {
      await this.select();
      this.formEditing$.next(false);
    }
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
  }

  select() {
    this.baseService.getById(this.routeId).subscribe({
      next: (item) => {
        if (!!item) {
          this.setMainFormData(item);
        }
      },
      error: (e) => {
        this.throwErrorMessage(e);
        this.redirectPreviousRoute(); // Se cair aqui é porque a pessoa colocou algo errado na rota
      },
    });
  }

  edit() {
    this.formEditing$.next(true);
  }

  afterFormEnable() {}

  async beforeSave() {
    if (this.mainForm.dirty || this.isTable('dirty')) {
      if (this.mainForm.invalid || this.isTable('invalid')) {
        this.toastr.error('Existem campos inválidos.');
        this.mainForm.markAllAsTouched(); // Para mostrar erros nas linhas
        this.componentTables?.forEach((table) =>
          table.formArray.markAllAsTouched()
        ); // Para mostrar erros nas tabelas
      } else {
        await this.save();
      }
    } else {
      this.toastr.error('Nenhum campo foi modificado.');
    }
  }

  async save() {
    const data = this.getRawData();

    if (this.isNewRecord) {
      await firstValueFrom(this.baseService.post(data))
        .then((response) => {
          this.afterInsert(response);
          this.toastr.success('Novo registro inserido com sucesso.');
          this.tabGroup.selectedIndex = 0;
        })
        .catch((e) => this.throwErrorMessage(e));
    } else {
      await firstValueFrom(this.baseService.put(data))
        .then(() => {
          this.tabGroup.selectedIndex = 0;
          if (this.componentTables?.length > 0 && this.saveTablesIndividually) {
            this.saveComponentTables();
          } else {
            this.toastr.success('Registro alterado com sucesso.');
            this.onClear();
            this.select();
          }
        })
        .catch((e) => this.throwErrorMessage(e));
    }
  }

  async saveComponentTables() {
    let tableHasErrors = false;
    const tablesWithErrors = new Array<string>();

    const promises = this.componentTables.map(async (table) => {
      if (!tableHasErrors) {
        await table.save();
        tablesWithErrors.push(table.tableName);
        tableHasErrors = table.tableHasErrors;
      }
    });
    await Promise.all(promises);

    if (!tableHasErrors) {
      this.toastr.success('Registros alterados com sucesso.');
      this.onClear();
      this.select();
    } else {
      // Quando é child table vai cair aqui
      this.toastr.error(
        `Erro ao salvar tabela(s) ${tablesWithErrors.map(
          (x) => ` ${x}`
        )}, os demais registros já foram salvos.`
      );
    }
  }

  afterInsert(response: any = null) {
    this.isNewRecord = false;
    this.mainForm.markAsPristine();
  }

  isTable(option: string) {
    if (this.componentTables?.length > 0) {
      switch (option) {
        case 'dirty':
          return this.componentTables.some((table) => table.formArray.dirty);
        case 'invalid':
          return this.componentTables.some((table) => table.formArray.invalid);
        default:
          return null;
      }
    }
    return false;
  }

  async beforeDelete() {
    const confirma = await DialogHelper.openDialog(
      'Exclusão',
      'Deseja excluir esse item?'
    );
    if (confirma) {
      this.delete();
    }
  }

  async delete() {
    await firstValueFrom(this.baseService.delete(this.routeId))
      .then(() => {
        this.afterDelete();
        this.toastr.success('Registro excluído com sucesso.');
      })
      .catch((e) => this.throwErrorMessage(e));
  }

  throwErrorMessage(
    e: any,
    defaultMessage: string = 'Ocorreram erros ao realizar a operação.'
  ) {
    if (!!e?.error?.errors) {
      const erros = Object.values(e.error.errors) as Array<any>;
      for (const value of erros) {
        this.toastr.error(value[0]);
      }
    } else {
      this.toastr.error(defaultMessage);
    }
  }

  afterDelete() {
    this.redirectPreviousRoute();
  }

  async beforeUndo() {
    if (this.mainForm.dirty || this.isTable('dirty')) {
      const confirma = await DialogHelper.openDialog(
        'Confirmação',
        'Deseja descartar alterações?'
      );
      if (confirma) {
        this.isUndoing = true;
        this.isNewRecord ? this.redirectPreviousRoute() : this.undo();
      }
    } else {
      this.isNewRecord ? this.redirectPreviousRoute() : this.undo();
    }
  }

  redirectPreviousRoute() {
    throw new Error('Método de redirecionamento anterior não implementado.');
  }

  async undo() {
    this.onClear();
    this.setMainFormData();
  }

  onClear() {
    this.formEditing$.next(false);
    this.mainForm.reset();

    if (!!this.tabGroup) {
      this.tabGroup.selectedIndex = 0;
    }
  }

  setMainFormData(item: any = this.originalData) {
    this.originalData = item;

    const keys = Object.keys(item);
    for (let key of keys) {
      this.mainForm.get(key)?.setValue(item[key]);
    }

    this.afterSetMainFormData();
  }

  afterSetMainFormData() {
    // Operações após tela estar com valores
  }

  getErrorMessage(control: FormControl | AbstractControl | null) {
    return FormHelper.getErrorMessage(control as FormControl);
  }

  getRawData() {
    return this.mainForm.getRawValue();
  }

  convertDateValue(date: Date) {
    if (!!date && typeof date !== 'string') {
      return (
        `${date.getFullYear()}-` +
        `${this.convertAux(date.getMonth() + 1)}-` +
        `${this.convertAux(date.getDate())}T` +
        `${this.convertAux(date.getHours())}:` +
        `${this.convertAux(date.getMinutes())}:` +
        `${this.convertAux(date.getSeconds())}`
      );
    }
    return date;
  }

  convertAux(n: number) {
    return n?.toString().padStart(2, '0');
  }

  setFieldValueAsNull(fieldName: string) {
    this.mainForm.get(fieldName)?.setValue(null);
    this.mainForm.get(fieldName)?.markAsDirty();
  }

  async confirmRedirect() {
    let descartar = true;

    if (!this.isUndoing && this.mainForm.enabled && !this.mainForm.pristine) {
      descartar = await DialogHelper.openDialog(
        'Descarte',
        'Deseja sair desta página e descartar as alterações?'
      );
    } else {
      descartar = true;
    }

    return descartar;
  }
}
