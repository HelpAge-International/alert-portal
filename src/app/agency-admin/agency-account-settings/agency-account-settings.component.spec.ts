import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAccountSettingsComponent } from './agency-account-settings.component';

describe('AgencyAccountSettingsComponent', () => {
  let component: AgencyAccountSettingsComponent;
  let fixture: ComponentFixture<AgencyAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAccountSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
