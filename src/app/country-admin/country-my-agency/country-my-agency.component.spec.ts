import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAccountSettingsComponent } from './country-account-settings.component';

describe('CountryAccountSettingsComponent', () => {
  let component: CountryAccountSettingsComponent;
  let fixture: ComponentFixture<CountryAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
