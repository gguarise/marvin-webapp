import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss'],
})
export class BaseComponent implements OnInit {
  dataSource = new MatTableDataSource<any>([]);
  deletedData = new Array();
  originalDataSource: any;
  newTableItemId = 0;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(public elementRef: ElementRef) {}

  ngOnInit() {
    this.select();
  }

  ngOnDestroy() {
    this.elementRef.nativeElement.remove();
    // this.dataSource.disconnect();
    this.table.ngOnDestroy();
  }

  select(data: any = null) {
    if (!!data) {
      this.originalDataSource = data;
      this.dataSource = data;
      this.table.renderRows();
    }
  }

  addRow() {
    this.dataSource.data.push({
      new: true,
    });
    this.table.renderRows();
  }

  deleteRow() {
    this.dataSource.data = this.dataSource.data.filter((data: any) => {
      if (data.select && !!data.id) {
        this.deletedData.push(data.id);
      }
      return !data.select;
    });
  }

  setRowAsModified(element: any) {
    element.modified = true;
  }

  edit() {}

  save() {}

  async undo() {
    // confirm
    this.select();
  }
}
