import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryDepartmentsComponent } from './country-departments.component';

describe('CountryDepartmentsComponent', () => {
  let component: CountryDepartmentsComponent;
  let fixture: ComponentFixture<CountryDepartmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryDepartmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
