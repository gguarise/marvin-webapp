import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrosTableComponent } from './carros-table.component';

describe('CarrosTableComponent', () => {
  let component: CarrosTableComponent;
  let fixture: ComponentFixture<CarrosTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CarrosTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CarrosTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
