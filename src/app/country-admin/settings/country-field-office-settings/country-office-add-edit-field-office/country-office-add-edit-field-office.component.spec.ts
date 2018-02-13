import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryOfficeAddEditFieldOfficeComponent } from './country-office-add-edit-field-office.component';

describe('CountryOfficeAddEditFieldOfficeComponent', () => {
  let component: CountryOfficeAddEditFieldOfficeComponent;
  let fixture: ComponentFixture<CountryOfficeAddEditFieldOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryOfficeAddEditFieldOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryOfficeAddEditFieldOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
