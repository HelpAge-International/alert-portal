import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyChangePasswordComponent } from './local-agency-change-password.component';

describe('LocalAgencyChangePasswordComponent', () => {
  let component: LocalAgencyChangePasswordComponent;
  let fixture: ComponentFixture<LocalAgencyChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
