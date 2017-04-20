import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryModulesSettingsComponent } from './country-modules-settings.component';

describe('CountryModulesSettingsComponent', () => {
  let component: CountryModulesSettingsComponent;
  let fixture: ComponentFixture<CountryModulesSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryModulesSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryModulesSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
