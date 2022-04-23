import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatorioOrdemServicoComponent } from './relatorio-ordem-servico.component';

describe('RelatorioOrdemServicoComponent', () => {
  let component: RelatorioOrdemServicoComponent;
  let fixture: ComponentFixture<RelatorioOrdemServicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatorioOrdemServicoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatorioOrdemServicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
