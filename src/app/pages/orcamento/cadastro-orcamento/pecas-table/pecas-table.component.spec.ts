import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PecasTableComponent } from './pecas-table.component';

describe('PecasTableComponent', () => {
  let component: PecasTableComponent;
  let fixture: ComponentFixture<PecasTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PecasTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PecasTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
