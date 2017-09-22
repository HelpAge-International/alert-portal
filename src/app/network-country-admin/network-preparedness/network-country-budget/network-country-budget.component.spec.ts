import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryBudgetComponent } from './network-country-budget.component';

describe('NetworkCountryBudgetComponent', () => {
  let component: NetworkCountryBudgetComponent;
  let fixture: ComponentFixture<NetworkCountryBudgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryBudgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
