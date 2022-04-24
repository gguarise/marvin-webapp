import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentosClienteTableComponent } from './orcamentos-cliente-table.component';

describe('OrcamentosClienteTableComponent', () => {
  let component: OrcamentosClienteTableComponent;
  let fixture: ComponentFixture<OrcamentosClienteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OrcamentosClienteTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrcamentosClienteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
