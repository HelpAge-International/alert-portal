import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAccountSettingsComponent } from './network-account-settings.component';

describe('NetworkAccountSettingsComponent', () => {
  let component: NetworkAccountSettingsComponent;
  let fixture: ComponentFixture<NetworkAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
