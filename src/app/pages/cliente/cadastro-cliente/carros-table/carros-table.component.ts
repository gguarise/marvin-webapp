import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { firstValueFrom, Subject } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Carro } from 'src/app/models/carro';
import { Fornecedor } from 'src/app/models/fornecedor';
import { TabelaFipe } from 'src/app/models/tabela-fipe';
import { CarroService } from 'src/app/services/carro.service';

@Component({
  selector: 'app-carros-table',
  templateUrl: './carros-table.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CarrosTableComponent),
      multi: true,
    },
  ],
  styleUrls: ['./carros-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CarrosTableComponent extends ChildBaseTableComponent {
  override tableName = 'Carros';
  marcas: TabelaFipe[];
  modelosPorMarca: Array<TabelaFipe[]> = [];
  protected _onDestroy = new Subject<void>();

  constructor(public carroService: CarroService, elementRef: ElementRef) {
    super(carroService, elementRef);
    this.formGroupConfig = {
      select: [false],
      clienteId: [],
      id: [],
      placa: [
        null,
        Validators.compose([Validators.required, Validators.maxLength(8)]),
      ],
      marca: [],
      marcasFiltradas: [],
      modelo: [],
      modelosFiltrados: [],
      ano: [
        null,
        Validators.compose([Validators.min(1850), Validators.max(2100)]),
      ],
      quilometragem: [],
      descricao: [null, Validators.maxLength(150)],
      modified: [],
      new: [],
    };
    this.displayedColumns = [
      'select',
      'placa',
      'marca',
      'modelo',
      'ano',
      'quilometragem',
      'descricao',
    ];
  }

  override ngOnInit() {
    this.getMarcas();
  }

  override setNewItem() {
    super.setNewItem();
    this.lastAddedItem.get('clienteId')?.setValue(this.parentId);
  }

  override getRawData() {
    const payload = this.formArray.getRawValue();
    payload.map((carro: Carro) => {
      carro.placa = carro.placa?.replace('-', '');
    });
    return payload;
  }

  override async save() {
    await super.save('placa');
  }

  // TODO ver se não é melhor travar a placa, testar modificar um registro ja existente e tal
  async searchPlaca(element: any) {
    const placa = element.get('placa')?.value?.replace('-', '');

    if (!!placa && placa.length === 7) {
      const carros = await firstValueFrom(
        this.carroService.searchByPlaca(placa)
      )
        .then((x) => x)
        .catch((e) => e);

      if (!!carros && !carros.error && carros.length > 0) {
        const id = element.get('id').value;
        if (!!id) {
          this.deletedData.push(element.get('id').value);
        }
        const carro = carros[0];
        element.get('id').setValue(carro.id);
        element.get('marca').setValue(carro.marca);
        element.get('modelo').setValue(carro.modelo);
        element.get('ano').setValue(carro.ano);
        element.get('quilometragem').setValue(carro.quilometragem);
        element.get('descricao').setValue(carro.descricao);
        element.get('new').setValue(false);

        this.toastr.info(
          'Um carro já existe para essa placa. As informações modificadas nele aqui alterarão o registro para demais clientes.'
        );
      } else {
        element.get('id').setValue(null);
        element.get('new').setValue(true);
      }
    }
  }

  async getMarcas() {
    this.marcas = (
      await firstValueFrom(this.carroService.getCarBrands()).then((x) => x)
    ).sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }

  filterMarcas(element: any) {
    const filterValue = element.get('marca')?.value?.toLowerCase();
    element
      .get('marcasFiltradas')
      .setValue(
        this.marcas.filter((option) =>
          option.name.toLowerCase().includes(filterValue)
        )
      );
  }

  async getModelos(element: any) {
    const marca = element.get('marca')?.value?.toLowerCase();

    if (!!marca && element.get('marca').dirty) {
      if (!this.modelosPorMarca[marca]) {
        const marcaObject = this.marcas.filter(
          (option) => option.name.toLowerCase() === marca
        );

        if (marcaObject?.length === 1) {
          this.modelosPorMarca[marca] = await firstValueFrom(
            this.carroService.getCarModels(marcaObject[0].code)
          ).then((x) => x);
        }
      }
      element.get('modelo').setValue(null);
      element.get('modelosFiltrados').setValue([]);
    }
  }

  filterModelos(element: any) {
    const filterValue = element.get('modelo')?.value;
    const marca = element.get('marca')?.value?.toLowerCase();

    element
      .get('modelosFiltrados')
      .setValue(
        this.modelosPorMarca[marca]?.filter((option) =>
          option.name.toLowerCase().includes(filterValue)
        )
      );
  }
}
