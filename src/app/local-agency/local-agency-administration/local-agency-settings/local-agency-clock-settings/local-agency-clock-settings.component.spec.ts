import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyClockSettingsComponent } from './local-agency-clock-settings.component';

describe('LocalAgencyClockSettingsComponent', () => {
  let component: LocalAgencyClockSettingsComponent;
  let fixture: ComponentFixture<LocalAgencyClockSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyClockSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyClockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
