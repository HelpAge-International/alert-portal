import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountrySettingsMenuComponent } from './network-country-settings-menu.component';

describe('NetworkCountrySettingsMenuComponent', () => {
  let component: NetworkCountrySettingsMenuComponent;
  let fixture: ComponentFixture<NetworkCountrySettingsMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountrySettingsMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountrySettingsMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
