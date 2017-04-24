import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryNotificationSettingsComponent } from './country-notification-settings.component';

describe('CountryNotificationSettingsComponent', () => {
  let component: CountryNotificationSettingsComponent;
  let fixture: ComponentFixture<CountryNotificationSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryNotificationSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryNotificationSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
