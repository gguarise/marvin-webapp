import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title: string = '';

  @Input() showEditButton = true;
  @Input() showSaveButton = true;
  @Input() showUndoButton = true;
  @Input() dialogComponentButton: string;

  @Output() editEvent = new EventEmitter();
  @Output() saveEvent = new EventEmitter();
  @Output() undoEvent = new EventEmitter();
  @Output() openDialogEvent = new EventEmitter();

  constructor() {}

  emitEditEvent() {
    if (this.showEditButton) {
      this.editEvent.emit('edit');
    }
    return true;
  }

  emitSaveEvent() {
    if (this.showSaveButton) {
      this.saveEvent.emit('save');
    }
    return true;
  }

  emitUndoEvent() {
    if (this.showUndoButton) {
      this.undoEvent.emit('undo');
    }
    return true;
  }

  emitOpenDialogEvent() {
    if (!!this.dialogComponentButton) {
      this.openDialogEvent.emit();
    }
    return true;
  }
}
