import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryFieldOfficeSettingsComponent } from './country-field-office-settings.component';

describe('CountryFieldOfficeSettingsComponent', () => {
  let component: CountryFieldOfficeSettingsComponent;
  let fixture: ComponentFixture<CountryFieldOfficeSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryFieldOfficeSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryFieldOfficeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
