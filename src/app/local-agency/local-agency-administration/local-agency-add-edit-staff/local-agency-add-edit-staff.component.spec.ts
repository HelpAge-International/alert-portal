import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditStaffComponent } from './local-agency-add-edit-staff.component';

describe('LocalAgencyAddEditStaffComponent', () => {
  let component: LocalAgencyAddEditStaffComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
