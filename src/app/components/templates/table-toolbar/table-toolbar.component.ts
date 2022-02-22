import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-table-toolbar',
  templateUrl: './table-toolbar.component.html',
  styleUrls: ['./table-toolbar.component.scss'],
})
export class TableToolbarComponent {
  @Input() isFormDisabled: boolean;

  @Output() addRow = new EventEmitter();
  @Output() deleteSelectedRows = new EventEmitter();

  constructor() {}

  emitAddRowEvent() {
    this.addRow.emit('addRow');
    return true;
  }

  emitDeleteSelectedRowsEvent() {
    this.deleteSelectedRows.emit('deleteSelectedRows');
    return true;
  }
}
