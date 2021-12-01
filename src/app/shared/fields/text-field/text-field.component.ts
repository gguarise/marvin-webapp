import { Component, Input, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/pages/base/base.component';

@Component({
  selector: 'app-text-field',
  templateUrl: './text-field.component.html',
  styleUrls: ['./text-field.component.scss'],
})
export class TextFieldComponent {
  @Input() value: any;
  @Input() baseComponent: BaseComponent;

  constructor() {}

  teste() {}
}
