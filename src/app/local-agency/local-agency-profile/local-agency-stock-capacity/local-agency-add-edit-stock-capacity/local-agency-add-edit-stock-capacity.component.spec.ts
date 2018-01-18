import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditStockCapacityComponent } from './local-agency-add-edit-stock-capacity.component';

describe('LocalAgencyAddEditStockCapacityComponent', () => {
  let component: LocalAgencyAddEditStockCapacityComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditStockCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditStockCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditStockCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
