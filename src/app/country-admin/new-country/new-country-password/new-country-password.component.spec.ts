import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCountryPasswordComponent } from './new-country-password.component';

describe('NewCountryPasswordComponent', () => {
  let component: NewCountryPasswordComponent;
  let fixture: ComponentFixture<NewCountryPasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewCountryPasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCountryPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
