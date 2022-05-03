import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildBaseTableComponent } from './child-base-table.component';

describe('ChildBaseTableComponent', () => {
  let component: ChildBaseTableComponent;
  let fixture: ComponentFixture<ChildBaseTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildBaseTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildBaseTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
