import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHazardNetworkCountryComponent } from './add-hazard-network-country.component';

describe('AddHazardNetworkCountryComponent', () => {
  let component: AddHazardNetworkCountryComponent;
  let fixture: ComponentFixture<AddHazardNetworkCountryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHazardNetworkCountryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHazardNetworkCountryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
