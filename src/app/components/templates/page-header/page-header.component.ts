import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss'],
})
export class PageHeaderComponent {
  @Input() title: string = '';

  @Input() showReturnButton = false;
  @Input() showEditButton = true;
  @Input() showSaveButton = true;
  @Input() showUndoButton = true;
  @Input() showDeleteButton = false;
  @Input() showCustomButton = false;
  @Input() showPrintButton = false;
  @Input() printButtonLabel = 'Imprimir';
  @Input() customButtonLabel = 'Novo';
  @Input() showNewButton = false;
  @Input() newButtonRoute = '/';
  @Input() dialogComponentButton: string;
  @Input() showDialogCloseButton = false;

  @Output() returnEvent = new EventEmitter();
  @Output() editEvent = new EventEmitter();
  @Output() saveEvent = new EventEmitter();
  @Output() undoEvent = new EventEmitter();
  @Output() deleteEvent = new EventEmitter();
  @Output() printEvent = new EventEmitter();
  @Output() openDialogEvent = new EventEmitter();
  @Output() customEvent = new EventEmitter();
  @Output() newEvent = new EventEmitter();
  @Output() dialogCloseEvent = new EventEmitter();

  constructor() {}

  emitReturnEvent() {
    if (this.showReturnButton) {
      this.returnEvent.emit('return');
    }
    return true;
  }

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

  emitDeleteEvent() {
    if (!!this.showDeleteButton) {
      this.deleteEvent.emit();
    }
    return true;
  }

  emitCustomEvent() {
    if (!!this.showCustomButton) {
      this.customEvent.emit();
    }
    return true;
  }

  emitNewEvent() {
    if (!!this.showNewButton) {
      this.newEvent.emit();
    }
    return true;
  }

  emitPrintEvent() {
    if (!!this.showPrintButton) {
      this.printEvent.emit();
    }
    return true;
  }

  emitOpenDialogEvent() {
    if (!!this.dialogComponentButton) {
      this.openDialogEvent.emit();
    }
    return true;
  }

  emitCloseDialogEvent() {
    if (!!this.showDialogCloseButton) {
      this.dialogCloseEvent.emit();
    }
    return true;
  }
}
