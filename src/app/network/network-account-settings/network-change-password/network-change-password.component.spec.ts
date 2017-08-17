import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkChangePasswordComponent } from './network-change-password.component';

describe('NetworkChangePasswordComponent', () => {
  let component: NetworkChangePasswordComponent;
  let fixture: ComponentFixture<NetworkChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
