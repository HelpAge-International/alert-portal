import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileStockCapacityComponent } from './network-country-profile-stock-capacity.component';

describe('NetworkCountryProfileStockCapacityComponent', () => {
  let component: NetworkCountryProfileStockCapacityComponent;
  let fixture: ComponentFixture<NetworkCountryProfileStockCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileStockCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileStockCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
