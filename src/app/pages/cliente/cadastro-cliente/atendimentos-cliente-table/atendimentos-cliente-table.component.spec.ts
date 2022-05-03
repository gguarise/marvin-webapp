import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentosClienteTableComponent } from './atendimentos-cliente-table.component';

describe('AtendimentosClienteTableComponent', () => {
  let component: AtendimentosClienteTableComponent;
  let fixture: ComponentFixture<AtendimentosClienteTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtendimentosClienteTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtendimentosClienteTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
