import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewUserPasswordComponent } from './new-user-password.component';

describe('NewUserPasswordComponent', () => {
  let component: NewUserPasswordComponent;
  let fixture: ComponentFixture<NewUserPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewUserPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewUserPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
