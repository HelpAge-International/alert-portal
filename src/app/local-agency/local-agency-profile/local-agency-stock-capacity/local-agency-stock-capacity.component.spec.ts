import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyStockCapacityComponent } from './local-agency-stock-capacity.component';

describe('LocalAgencyStockCapacityComponent', () => {
  let component: LocalAgencyStockCapacityComponent;
  let fixture: ComponentFixture<LocalAgencyStockCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyStockCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyStockCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
