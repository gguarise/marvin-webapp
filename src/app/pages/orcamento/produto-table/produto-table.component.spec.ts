import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProdutoTableComponent } from './produto-table.component';

describe('ProdutoTableComponent', () => {
  let component: ProdutoTableComponent;
  let fixture: ComponentFixture<ProdutoTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProdutoTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProdutoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
