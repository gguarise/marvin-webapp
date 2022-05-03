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
import { Carro } from 'src/app/models/carro';

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

  override afterSetMainFormData() {
    // Operações após tela estar com valores

    // Preenche id de cliente nos carros
    const carros = this.mainForm.get('carros')?.value;
    carros?.forEach((carro: Carro) => {
      carro.clienteId = this.routeId;
    });
    this.mainForm.get('carros')?.setValue(carros);
  }

  async searchEndereco() {
    const cep = this.mainForm.get('cep')?.value?.replace(/\D/g, '');
    if (cep?.length === 8) {
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

    form.telefone = form.telefone?.replace(/\D/g, '') ?? null;
    form.cep = form.cep?.replace(/\D/g, '') ?? null;
    form.cpf = form.cpf?.replace(/\D/g, '') ?? null;

    if (this.isNewRecord) {
      form.carros = this.carrosTable.formArray.getRawValue();
      form.carros?.forEach((carro: Carro) => {
        carro.placa = carro.placa.toUpperCase();
      });
    }
    return form;
  }
}
