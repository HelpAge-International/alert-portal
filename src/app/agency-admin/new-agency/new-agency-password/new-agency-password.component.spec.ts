import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewAgencyPasswordComponent } from './new-agency-password.component';

describe('NewAgencyPasswordComponent', () => {
  let component: NewAgencyPasswordComponent;
  let fixture: ComponentFixture<NewAgencyPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewAgencyPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewAgencyPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
