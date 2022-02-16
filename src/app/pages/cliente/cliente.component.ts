import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { ViaCEP } from 'src/app/models/via-cep';
import { ClienteService } from 'src/app/services/cliente.service';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent extends BaseComponent {
  mainForm: FormGroup;

  constructor(
    dialog: MatDialog,
    elementRef: ElementRef,
    fb: FormBuilder,
    cdr: ChangeDetectorRef,
    toastr: ToastrService,
    public clienteService: ClienteService
  ) {
    super(dialog, elementRef, fb, toastr, cdr);
    this.mainForm = this.fb.group({
      id: [],
      nome: [],
      contatoPrincipal: [],
      email: [],
      cpf: [],
      cep: [],
      endereco: [null, Validators.compose([Validators.max(400)])],
      carros: [],
      orcamentos: [],
      atendimentos: [],
    });
  }

  async searchEndereco() {
    const cep = this.mainForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep.length === 8) {
      const endereco = await firstValueFrom(
        this.clienteService.getEnderecoPorCEP(cep)
      )
        .then((x) => x)
        .catch((e) => e);

      if (!endereco.erro) {
        this.mainForm
          .get('endereco')
          ?.setValue(
            `${endereco.logradouro}, ${endereco.complemento} - ${endereco.bairro} - ${endereco.localidade}/${endereco.uf}`
          );
      }
    }
  }
}
