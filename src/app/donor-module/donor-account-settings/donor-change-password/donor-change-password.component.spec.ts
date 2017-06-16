import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DonorChangePasswordComponent } from './donor-change-password.component';

describe('DonorChangePasswordComponent', () => {
  let component: DonorChangePasswordComponent;
  let fixture: ComponentFixture<DonorChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DonorChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DonorChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
