import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAddEditStaffComponent } from './country-add-edit-staff.component';

describe('CountryAddEditStaffComponent', () => {
  let component: CountryAddEditStaffComponent;
  let fixture: ComponentFixture<CountryAddEditStaffComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAddEditStaffComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAddEditStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
