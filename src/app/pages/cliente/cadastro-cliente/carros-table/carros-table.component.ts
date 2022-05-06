import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { firstValueFrom, Observable } from 'rxjs';
import { ChildBaseTableComponent } from 'src/app/components/base/child-base-table/child-base-table.component';
import { Carro } from 'src/app/models/carro';
import { TabelaFipe } from 'src/app/models/tabela-fipe';
import { CarroService } from 'src/app/services/carro.service';
import { duplicateTableValueValidator } from 'src/core/validators/duplicate-table-value-validator';

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
  marcas: TabelaFipe[]; // Todas as marcas
  modelosPorMarca: Array<TabelaFipe[]> = []; // A chave do Array é o nome da marca em minusculo: array['fiat'] -> possui lista de modelos da fiat

  constructor(
    public carroService: CarroService,
    public cdr: ChangeDetectorRef,
    elementRef: ElementRef
  ) {
    super(carroService, elementRef);
    this.formGroupConfig = {
      select: [false],
      clienteId: [],
      id: [],
      placa: [
        null,
        Validators.compose([
          Validators.required,
          Validators.maxLength(8),
          duplicateTableValueValidator('placa', 'Placa', true),
        ]),
      ],
      marca: [],
      marcasFiltradas: [], // Lista de marcas disponíveis para selecionar em cada linha (baseadas no texto)
      modelo: [],
      modelosFiltrados: [], // Lista de modelos disponíveis para selecionar em cada linha
      carregandoModelos: [false], // Controla o spinner do modelo de cada linha
      ano: [
        null,
        Validators.compose([Validators.min(1886), Validators.max(2200)]),
      ],
      quilometragem: [],
      descricao: [null, Validators.maxLength(150)],
      ativo: [true],
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
      carro.placa = carro.placa.toUpperCase(); // ?.replace('-', '')
    });
    return payload;
  }

  override async save() {
    await super.save('placa');
  }

  override tableDeleteMethod(id: string): Observable<any> {
    return this.carroService.deleteByIdCliente(id, this.parentId);
  }

  override afterFormEnable() {
    this.formArray.controls.forEach((item) => {
      item.get('placa')?.disable();
      this.getModelos(item);
      this.filterMarcas(item);
    });
  }

  async searchPlaca(element: any) {
    // Caso a placa esteja repetida ele não vai buscar (duplicateTableValueValidator)
    if (element.valid) {
      const placa = element.get('placa')?.value; // ?.replace('-', '');

      if (placa?.length === 8) {
        const carros = await firstValueFrom(
          this.carroService.searchByPlaca(placa)
        )
          .then((x) => x)
          .catch((e) => e);

        if (!!carros && !carros.error && carros.length > 0) {
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
          element.get('clienteId').setValue(this.parentId);
          element.get('id').setValue(null);
          element.get('new').setValue(true);
        }
      }
    }
  }

  async getMarcas() {
    this.marcas = (
      await firstValueFrom(this.carroService.getCarBrands()).then((x) => x)
    ).sort((a, b) => (a.name > b.name ? 1 : b.name > a.name ? -1 : 0));
  }

  filterMarcas(element: any) {
    const filterValue = element.get('marca')?.value?.toLowerCase() ?? '';
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
    const carregandoModelos = element.get('carregandoModelos'); // Controla o spinner

    if (!!marca) {
      // Se comando não foi chamado no afterFormEnable
      if (element.get('marca').dirty) {
        element.get('modelo').setValue(null);
        element.get('modelosFiltrados').setValue([]);
        carregandoModelos.setValue(true);
      }

      if (!this.modelosPorMarca[marca]) {
        const marcaObject = this.marcas.filter(
          (option) => option.name.toLowerCase() === marca
        );

        if (marcaObject?.length === 1) {
          this.modelosPorMarca[marca] = await firstValueFrom(
            this.carroService.getCarModels(marcaObject[0].code)
          ).then((x) => {
            carregandoModelos.setValue(false);
            return x;
          });
        } else {
          carregandoModelos.setValue(false);
        }
      } else {
        carregandoModelos.setValue(false);
      }
    }

    // Se comando não foi chamado no afterFormEnable
    if (element.get('marca').dirty) {
      element.get('modelosFiltrados').setValue(this.modelosPorMarca[marca]);
    }
    this.cdr.detectChanges();
  }

  filterModelos(element: any) {
    const filterValue = element.get('modelo')?.value?.toLowerCase() ?? '';
    const marca = element.get('marca')?.value?.toLowerCase();

    if (!!marca) {
      element
        .get('modelosFiltrados')
        .setValue(
          this.modelosPorMarca[marca]?.filter((option) =>
            option.name.toLowerCase().includes(filterValue)
          )
        );
    }
  }
}
