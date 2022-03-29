import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicoTableComponent } from './servico-table.component';

describe('ServicoTableComponent', () => {
  let component: ServicoTableComponent;
  let fixture: ComponentFixture<ServicoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ServicoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
