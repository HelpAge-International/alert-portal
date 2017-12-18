import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfilePartnersComponent } from './network-country-profile-partners.component';

describe('NetworkCountryProfilePartnersComponent', () => {
  let component: NetworkCountryProfilePartnersComponent;
  let fixture: ComponentFixture<NetworkCountryProfilePartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfilePartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfilePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
