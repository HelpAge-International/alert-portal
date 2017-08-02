import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSettingProfileComponent } from './account-setting-profile.component';

describe('AccountSettingProfileComponent', () => {
  let component: AccountSettingProfileComponent;
  let fixture: ComponentFixture<AccountSettingProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSettingProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSettingProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
