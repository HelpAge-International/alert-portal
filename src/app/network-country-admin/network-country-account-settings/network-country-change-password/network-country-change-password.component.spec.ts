import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryChangePasswordComponent } from './network-country-change-password.component';

describe('NetworkCountryChangePasswordComponent', () => {
  let component: NetworkCountryChangePasswordComponent;
  let fixture: ComponentFixture<NetworkCountryChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
