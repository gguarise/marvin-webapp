import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormBuilder, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import {
  Subject,
} from 'rxjs';
import { AppInjectorService } from 'src/app/services/app-injector.service';
import { BaseService } from 'src/app/services/base.service';
import { BaseTableComponent } from '../base-table/base-table.component';

@Component({
  selector: 'app-child-base-table',
  templateUrl: './child-base-table.component.html',
  styleUrls: ['./child-base-table.component.scss']
})
export abstract class ChildBaseTableComponent extends BaseTableComponent {

  @Input() parentId: any = null;
  @Input() override originalDataSource: any; // Dados do componente pai

  constructor(tableService: BaseService, elementRef: ElementRef) {
    super(tableService, elementRef);
    this.toastr = AppInjectorService.injector.get(ToastrService);
    this.fb = AppInjectorService.injector.get(FormBuilder);
  }

  override async beforeUndo() {
    this.undo();
  }

  override async undo() {
    this.setItems(this.originalDataSource);
    this.onClear();
  }

  override setInitialData() {
    this.deletedData = [];
    this.clearSelections();
  }

  writeValue(values: any): void {
    this.setItems(values);
  }

  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }
}
