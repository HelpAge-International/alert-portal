import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryClockSettingsComponent } from './network-country-clock-settings.component';

describe('NetworkCountryClockSettingsComponent', () => {
  let component: NetworkCountryClockSettingsComponent;
  let fixture: ComponentFixture<NetworkCountryClockSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryClockSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryClockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
