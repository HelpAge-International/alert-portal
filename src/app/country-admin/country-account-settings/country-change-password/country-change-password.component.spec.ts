import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryChangePasswordComponent } from './country-change-password.component';

describe('CountryChangePasswordComponent', () => {
  let component: CountryChangePasswordComponent;
  let fixture: ComponentFixture<CountryChangePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
