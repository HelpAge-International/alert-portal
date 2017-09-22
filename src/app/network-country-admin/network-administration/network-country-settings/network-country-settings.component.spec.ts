import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountrySettingsComponent } from './network-country-settings.component';

describe('NetworkCountrySettingsComponent', () => {
  let component: NetworkCountrySettingsComponent;
  let fixture: ComponentFixture<NetworkCountrySettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountrySettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountrySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
