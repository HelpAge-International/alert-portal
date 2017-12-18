import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkAdministrationSettingsComponent } from './local-network-administration-settings.component';

describe('LocalNetworkAdministrationSettingsComponent', () => {
  let component: LocalNetworkAdministrationSettingsComponent;
  let fixture: ComponentFixture<LocalNetworkAdministrationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkAdministrationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkAdministrationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
