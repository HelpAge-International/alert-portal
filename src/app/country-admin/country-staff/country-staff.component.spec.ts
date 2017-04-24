import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStaffComponent } from './country-staff.component';

describe('CountryStaffComponent', () => {
  let component: CountryStaffComponent;
  let fixture: ComponentFixture<CountryStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
