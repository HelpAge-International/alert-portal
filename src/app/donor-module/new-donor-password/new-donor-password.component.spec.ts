import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDonorPasswordComponent } from './new-donor-password.component';

describe('NewDonorPasswordComponent', () => {
  let component: NewDonorPasswordComponent;
  let fixture: ComponentFixture<NewDonorPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDonorPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDonorPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
