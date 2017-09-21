import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalInviteAgenciesComponent } from './local-invite-agencies.component';

describe('LocalInviteAgenciesComponent', () => {
  let component: LocalInviteAgenciesComponent;
  let fixture: ComponentFixture<LocalInviteAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalInviteAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalInviteAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
