import { Component, ElementRef, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppInjectorService } from 'src/app/services/app-injector.service';
import { BaseService } from 'src/app/services/base.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-child-base-table',
  templateUrl: './child-base-table.component.html',
  styleUrls: ['./child-base-table.component.scss'],
})
export abstract class ChildBaseTableComponent extends BaseTableComponent {
  tableName = '';
  tableHasErrors = true;

  @Input() parentId: any = null;
  @Input() override originalDataSource: any; // Dados do componente pai

  constructor(tableService: BaseService, elementRef: ElementRef) {
    super(tableService, elementRef);
    this.toastr = AppInjectorService.injector.get(ToastrService);
    this.fb = AppInjectorService.injector.get(FormBuilder);
  }

  override ngOnInit() {}

  override async beforeUndo() {
    this.undo();
  }

  override async save(propertyNameErrorMessage: string = 'name') {
    this.setRowsAsModified();
    await super.save(propertyNameErrorMessage);
  }

  override async undo() {
    this.setItems(this.originalDataSource);
    this.onClear();
  }

  override deleteSelectedRows() {
    super.deleteSelectedRows();
  }

  override setInitialData() {
    this.deletedData = [];
    this.clearSelections();
  }

  override compare(o1: any, o2: any): boolean {
    return o1 === o2;
  }

  override afterSave() {
    // Para BaseComponent ver se existem erros
    this.tableHasErrors =
      this.errosInserirAlterar.length > 0 || this.errosDeletar.length > 0;
  }

  override afterFormEnable() {
    // Pode ser usado pra desabilitar campos após formulário ser habilitado
  }

  writeValue(values: any): void {
    this.setItems(values);
  }

  registerOnChange(fn: any): void {}
  registerOnTouched(fn: any): void {}
}
