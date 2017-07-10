import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewDirectorPasswordComponent } from './new-director-password.component';

describe('NewDirectorPasswordComponent', () => {
  let component: NewDirectorPasswordComponent;
  let fixture: ComponentFixture<NewDirectorPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewDirectorPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDirectorPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
