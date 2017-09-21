import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileStockCapacityComponent } from './local-network-profile-stock-capacity.component';

describe('LocalNetworkProfileStockCapacityComponent', () => {
  let component: LocalNetworkProfileStockCapacityComponent;
  let fixture: ComponentFixture<LocalNetworkProfileStockCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileStockCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileStockCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
