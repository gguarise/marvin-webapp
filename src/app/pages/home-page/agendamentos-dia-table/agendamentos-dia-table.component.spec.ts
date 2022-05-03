import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendamentosDiaTableComponent } from './agendamentos-dia-table.component';

describe('AgendamentosDiaTableComponent', () => {
  let component: AgendamentosDiaTableComponent;
  let fixture: ComponentFixture<AgendamentosDiaTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendamentosDiaTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendamentosDiaTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
