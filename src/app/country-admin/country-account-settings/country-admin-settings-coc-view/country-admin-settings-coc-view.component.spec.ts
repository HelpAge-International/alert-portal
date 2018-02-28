import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAdminSettingsCocViewComponent } from './country-admin-settings-coc-view.component';

describe('CountryAdminSettingsCocViewComponent', () => {
  let component: CountryAdminSettingsCocViewComponent;
  let fixture: ComponentFixture<CountryAdminSettingsCocViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAdminSettingsCocViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAdminSettingsCocViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
