import { ChangeDetectionStrategy, Component, ElementRef, forwardRef } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarrosTableComponent extends ChildBaseTableComponent {
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
    this.lastAddedItem.get('ativo')?.setValue(true); // TODO retirar depois
  }

  override getRawData() {
    const payload = this.formArray.getRawValue();
    payload.map((fornecedor: Fornecedor) => {
      fornecedor.cnpj = fornecedor.cnpj?.replace(/\D/g, '');
      fornecedor.telefone = fornecedor.telefone?.replace(/\D/g, '');
    });
    return payload;
  }

  async getMarcas() {
    this.marcas = (await firstValueFrom(
      this.carroService.getCarBrands()
      ).then((x) => x)
      ).sort((a, b) =>
        a.name > b.name ? 1 : b.name > a.name ? -1 : 0
      );
  }

  filterMarcas(element: any) {
    const filterValue = element.get('marca')?.value?.toLowerCase();
    element.get('marcasFiltradas').setValue(this.marcas.filter(option => option.name.toLowerCase().includes(filterValue)));
  }

  async getModelos(element: any) {
    const marca = element.get('marca')?.value?.toLowerCase();

    if (!!marca) {
      if (!this.modelosPorMarca[marca]) {
        const marcaObject = this.marcas.filter(option => option.name.toLowerCase() === marca);

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

    element.get('modelosFiltrados').setValue(
      this.modelosPorMarca[marca]?.filter(option => option.name.toLowerCase().includes(filterValue))
    );
  }
}
