import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material/form-field';

@Component({
  selector: 'app-datetime-field',
  templateUrl: './datetime-field.component.html',
  styleUrls: ['./datetime-field.component.scss'],
})
export class DatetimeFieldComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() formControlName = '';
  @ViewChild('picker') picker: any;

  constructor() {}

  ngOnInit(): void {}

  datePickerOpen() {
    if (!this.picker.opened) {
      this.picker.open();
    }
  }
}
