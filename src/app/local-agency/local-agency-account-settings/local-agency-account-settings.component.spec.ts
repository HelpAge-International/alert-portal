import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAccountSettingsComponent } from './local-agency-account-settings.component';

describe('LocalAgencyAccountSettingsComponent', () => {
  let component: LocalAgencyAccountSettingsComponent;
  let fixture: ComponentFixture<LocalAgencyAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
