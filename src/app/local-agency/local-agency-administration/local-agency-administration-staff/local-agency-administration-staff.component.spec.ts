import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocaAgencyAdministrationStaffComponent } from './local-agency-administration-staff.component';

describe('LocaAgencyAdministrationStaffComponent', () => {
  let component: LocaAgencyAdministrationStaffComponent;
  let fixture: ComponentFixture<LocaAgencyAdministrationStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocaAgencyAdministrationStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocaAgencyAdministrationStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
