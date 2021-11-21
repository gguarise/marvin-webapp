import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

export interface UsersData {
  name: string;
  id: number;
}

const ELEMENT_DATA: UsersData[] = [
  { id: 1, name: 'Fornecedor Cabral' },
  { id: 2, name: 'Fornecedor Batel' },
  { id: 3, name: 'Fornecedor Vila Izabel' },
];

@Component({
  selector: 'app-fornecedor',
  templateUrl: './fornecedor.component.html',
  styleUrls: ['./fornecedor.component.scss'],
})
export class FornecedorComponent {
  displayedColumns: string[] = ['select', 'id', 'name'];
  dataSource = ELEMENT_DATA;

  @ViewChild(MatTable, { static: true }) table: MatTable<any>;

  constructor(public dialog: MatDialog) {}

  teste() {
    console.log('A');
  }

  addRowData() {
    this.dataSource.push(Object.create(null));
    this.table.renderRows();
  }
  updateRowData(row_obj: any) {
    this.dataSource = this.dataSource.filter((value, key) => {
      if (value.id == row_obj.id) {
        value.name = row_obj.name;
      }
      return true;
    });
  }
  deleteRowData(row_obj: any) {
    this.dataSource = this.dataSource.filter((value, key) => {
      return value.id != row_obj.id;
    });
  }
}
