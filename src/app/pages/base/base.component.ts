import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { cloneDeep } from 'lodash';
import { Observable, of } from 'rxjs';

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
  newTableItemId = 0;
  formGroupConfig: any;
  lastAddedItem: FormGroup;

  constructor(
    public elementRef: ElementRef,
    public fb: FormBuilder,
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
      this.dataSource = new MatTableDataSource(this.formArray.controls);
    }
    this.formArray.disable();
  }

  addRow(newItem: boolean = true) {
    this.lastAddedItem = this.fb.group(
      Object.assign({}, cloneDeep(this.formGroupConfig))
    );
    if (newItem) {
      this.lastAddedItem.get('new')?.setValue(true);
      this.dataSource = new MatTableDataSource(this.formArray.controls);
    }
    this.formArray.push(this.lastAddedItem);
  }

  deleteSelectedRows() {
    const selectedItems = this.dataSource.data.filter(
      (item) => item.get('select')?.value
    );

    selectedItems.forEach((item: any) => {
      if (!!item.get('id')?.value) {
        this.deletedData.push(item.get('id').value);
      }
      const index = this.dataSource.data.findIndex((x) => x === item);
      this.formArray.removeAt(index);
      this.dataSource = new MatTableDataSource(this.formArray.controls);
    });
  }

  setRowsAsModified() {
    if (this.formArray.controls.length > 0) {
      this.formArray.controls.forEach((x) => {
        (x as FormGroup).controls['modified']?.setValue(x.dirty);
      });
    }
  }

  edit() {
    this.formArray.enable();
  }

  async beforeSave() {
    // verifica se formulario dirty
    // verifica se algum campo inválido
    this.setRowsAsModified();
    await this.save();
    await this.select();
  }

  save() {
    this.dataSource.data.forEach((item) => {});
  }

  async undo() {
    // confirm
    this.setItems(this.originalDataSource);
  }
}
