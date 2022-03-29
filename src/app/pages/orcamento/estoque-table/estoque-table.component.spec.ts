import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstoqueTableComponent } from './estoque-table.component';

describe('EstoqueTableComponent', () => {
  let component: EstoqueTableComponent;
  let fixture: ComponentFixture<EstoqueTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EstoqueTableComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EstoqueTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
