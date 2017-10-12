import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryAccountSettingsComponent } from './network-country-account-settings.component';

describe('NetworkCountryAccountSettingsComponent', () => {
  let component: NetworkCountryAccountSettingsComponent;
  let fixture: ComponentFixture<NetworkCountryAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
