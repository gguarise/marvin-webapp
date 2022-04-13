import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppInjectorService } from 'src/app/services/app-injector.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  mainForm: FormGroup;

  constructor(fb: FormBuilder) {
    this.mainForm = fb.group({
      descricao: ['Teste'],
    });
  }
}
