import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryPermissionSettingsComponent } from './country-permission-settings.component';

describe('CountryPermissionSettingsComponent', () => {
  let component: CountryPermissionSettingsComponent;
  let fixture: ComponentFixture<CountryPermissionSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryPermissionSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryPermissionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
