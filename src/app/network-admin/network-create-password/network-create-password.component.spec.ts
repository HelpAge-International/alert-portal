import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCreatePasswordComponent } from './network-create-password.component';

describe('NetworkCreatePasswordComponent', () => {
  let component: NetworkCreatePasswordComponent;
  let fixture: ComponentFixture<NetworkCreatePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCreatePasswordComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCreatePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
