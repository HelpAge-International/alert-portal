import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyChangePasswordComponent } from './agency-change-password.component';

describe('AgencyChangePasswordComponent', () => {
  let component: AgencyChangePasswordComponent;
  let fixture: ComponentFixture<AgencyChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
