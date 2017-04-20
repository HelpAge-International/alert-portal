import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryClockSettingsComponent } from './country-clock-settings.component';

describe('CountryClockSettingsComponent', () => {
  let component: CountryClockSettingsComponent;
  let fixture: ComponentFixture<CountryClockSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryClockSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryClockSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
