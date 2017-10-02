import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryModuleSettingsComponent } from './network-country-module-settings.component';

describe('NetworkCountryModuleSettingsComponent', () => {
  let component: NetworkCountryModuleSettingsComponent;
  let fixture: ComponentFixture<NetworkCountryModuleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryModuleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryModuleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
