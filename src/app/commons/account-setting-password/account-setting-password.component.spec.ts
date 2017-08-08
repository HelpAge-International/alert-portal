import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingPasswordComponent } from './account-setting-password.component';

describe('AccountSettingPasswordComponent', () => {
  let component: AccountSettingPasswordComponent;
  let fixture: ComponentFixture<AccountSettingPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
