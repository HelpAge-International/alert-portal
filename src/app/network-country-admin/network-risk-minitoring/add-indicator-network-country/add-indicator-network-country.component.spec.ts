import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIndicatorNetworkCountryComponent } from './add-indicator-network-country.component';

describe('AddIndicatorNetworkCountryComponent', () => {
  let component: AddIndicatorNetworkCountryComponent;
  let fixture: ComponentFixture<AddIndicatorNetworkCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddIndicatorNetworkCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddIndicatorNetworkCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
