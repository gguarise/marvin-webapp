import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Subject } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/components/shared/dialogs/confirm-dialog/confirm-dialog.component';
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
  componentTables: ChildBaseTableComponent[];

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

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
    this.toastr = AppInjectorService.injector.get(ToastrService);
    this.fb = AppInjectorService.injector.get(FormBuilder);

    this.formEditing$.subscribe((isEditing) => {
      isEditing ? this.mainForm.enable() : this.mainForm.disable();
      this.componentTables?.forEach(table => {
        isEditing ? table.formArray.enable() : table.formArray.disable();
      });
    });
  }

  async ngOnInit() {
    this.routeId = this.route.snapshot.paramMap.get('id');

    if (!this.routeId) {
      this.isNewRecord = true;
    }
    else {
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
      error: () => this.toastr.error('Um erro ocorreu ao buscar itens.'),
    });
  }

  edit() {
    this.formEditing$.next(true);
  }

  async beforeSave() {
    if (this.mainForm.dirty || this.isTable('dirty')) {
      if (this.mainForm.invalid || this.isTable('invalid')) {
        this.toastr.error('Existem campos inválidos.');
        this.mainForm.markAllAsTouched(); // Para mostrar erros nas linhas
        this.componentTables?.forEach(table => table.formArray.markAllAsTouched()); // Para mostrar erros nas tabelas
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
        })
        .catch(() => this.toastr.error('Não foi possível criar novo registro.'));
    } else {
      await firstValueFrom(this.baseService.put(data))
        .then(() => {
          if (this.componentTables?.length > 0) {
            this.saveComponentTables();
          }
          else {
            this.toastr.success('Registro alterado com sucesso.');
            this.onClear();
            this.select();
          }
        })
        .catch(() => this.toastr.error('Não foi possível salvar as alterações.'));
    }
  }

  async saveComponentTables() {
    await this.componentTables.forEach(async table => {
      await table.beforeSave();
    });
    this.toastr.success('Registro alterado com sucesso.');
    this.onClear();
    this.select();
  }

  afterInsert(response: any) {
    throw new Error('Método de redirecionamento após inserção não implementado.');
  }

  isTable(option: string) {
    if (this.componentTables?.length > 0) {
      switch (option) {
        case 'dirty':
          return this.componentTables.some(table => table.formArray.dirty);
        case 'invalid':
          return this.componentTables.some(table => table.formArray.invalid);
        default:
          return null;
      }
    }
    return false;
  }

  async beforeDelete() {
    const confirma = await DialogHelper.openDialog(
      'Deletar',
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
      .catch(() => this.toastr.error('Não foi possível excluir registro.'));
  }

  afterDelete() {
    this.redirectPreviousRoute();
  }

  async beforeUndo() {
    if (this.mainForm.dirty || this.isTable('dirty')) {
      const confirma = await DialogHelper.openDialog(
        'Confirmar',
        'Deseja descartar alterações?'
      );
      if (confirma) {
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
  }

  setMainFormData(item: any = this.originalData) {
    this.originalData = item;

    const keys = Object.keys(item);
    for (let key of keys) {
      this.mainForm.get(key)?.setValue(item[key]);
    }
  }

  getErrorMessage(control: FormControl | AbstractControl | null) {
    return FormHelper.getErrorMessage(control as FormControl);
  }
  
  getRawData() {
    return this.mainForm.getRawValue();
  }
}
