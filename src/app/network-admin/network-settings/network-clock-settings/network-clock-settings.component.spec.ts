import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkClockSettingsComponent } from './network-clock-settings.component';

describe('NetworkClockSettingsComponent', () => {
  let component: NetworkClockSettingsComponent;
  let fixture: ComponentFixture<NetworkClockSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkClockSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkClockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
