import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileStockCapacityAddEditComponent } from './local-network-profile-stock-capacity-add-edit.component';

describe('LocalNetworkProfileStockCapacityAddEditComponent', () => {
  let component: LocalNetworkProfileStockCapacityAddEditComponent;
  let fixture: ComponentFixture<LocalNetworkProfileStockCapacityAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileStockCapacityAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileStockCapacityAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
