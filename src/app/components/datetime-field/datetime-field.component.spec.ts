import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatetimeFieldComponent } from './datetime-field.component';

describe('DatetimeFieldComponent', () => {
  let component: DatetimeFieldComponent;
  let fixture: ComponentFixture<DatetimeFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatetimeFieldComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatetimeFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
