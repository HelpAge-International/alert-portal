import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkModuleSettingsComponent } from './network-module-settings.component';

describe('NetworkModuleSettingsComponent', () => {
  let component: NetworkModuleSettingsComponent;
  let fixture: ComponentFixture<NetworkModuleSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkModuleSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkModuleSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
