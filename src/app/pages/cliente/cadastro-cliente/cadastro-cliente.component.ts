import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import { Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { BaseComponent } from 'src/app/components/base/base.component';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CarrosTableComponent } from './carros-table/carros-table.component';
import { FieldValidators } from 'src/core/validators/field-validators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cadastro-cliente',
  templateUrl: './cadastro-cliente.component.html',
  styleUrls: ['./cadastro-cliente.component.scss'],
})
export class CadastroClienteComponent
  extends BaseComponent
  implements AfterViewInit
{
  @ViewChild(CarrosTableComponent, { static: false })
  carrosTable: CarrosTableComponent;

  constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef,
    route: ActivatedRoute,
    public router: Router,
    public clienteService: ClienteService,
    // Ambos abaixo para controlar o comportamento para Tela de Cadastro de Orçamento
    @Optional() public dialogRef: MatDialogRef<CadastroClienteComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public isDialogComponent: boolean
  ) {
    super(clienteService, elementRef, cdr, route);
    this.mainForm = this.fb.group({
      id: [],
      nome: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(150)]),
      ],
      telefone: [],
      email: [],
      cpf: [null, FieldValidators.CPF],
      cep: [null],
      endereco: [null, Validators.compose([Validators.maxLength(400)])],
      carros: [],
      orcamentos: [],
      atendimentos: [],
      modified: [],
      new: [],
    });
  }

  ngAfterViewInit() {
    this.componentTables = [this.carrosTable];
  }

  async searchEndereco() {
    const cep = this.mainForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep.length === 8) {
      const endereco = await firstValueFrom(
        this.clienteService.getEnderecoPorCEP(cep)
      )
        .then((x) => x)
        .catch((e) => e);

      if (!endereco.erro && !!endereco.logradouro) {
        this.mainForm
          .get('endereco')
          ?.setValue(
            `${endereco.logradouro}, ${endereco.complemento} - ${endereco.bairro} - ${endereco.localidade}/${endereco.uf}`
          );
      } else {
        this.mainForm.get('endereco')?.setValue(null);
      }
    }
  }

  override async beforeSave() {
    const carros = this.carrosTable.formArray.getRawValue();
    if (!carros || carros?.length <= 0) {
      this.toastr.error('O cliente deve ter ao menos um carro cadastrado');
    } else {
      super.beforeSave();
    }
  }

  override redirectPreviousRoute(): void {
    this.router.navigate(['/cliente']);
  }

  override afterInsert(response: any) {
    super.afterInsert();
    if (!this.isDialogComponent) {
      this.router.navigate(['/cadastro-cliente', response?.id]);
    } else {
      this.dialogRef.close(true);
    }
  }

  dialogClose() {
    this.dialogRef.close(false);
  }

  override getRawData() {
    const form = super.getRawData();

    if (this.isNewRecord) {
      form.carros = this.carrosTable.formArray.getRawValue();
    }
    return form;
  }
}
