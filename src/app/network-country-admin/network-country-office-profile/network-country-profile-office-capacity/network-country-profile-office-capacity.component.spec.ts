import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileOfficeCapacityComponent } from './network-country-profile-office-capacity.component';

describe('NetworkCountryProfileOfficeCapacityComponent', () => {
  let component: NetworkCountryProfileOfficeCapacityComponent;
  let fixture: ComponentFixture<NetworkCountryProfileOfficeCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileOfficeCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileOfficeCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
