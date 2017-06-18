import {async, ComponentFixture, TestBed} from "@angular/core/testing";

import {CountryOfficeComponent} from "./country-office.component";

describe('CountryOfficeComponent', () => {
  let component: CountryOfficeComponent;
  let fixture: ComponentFixture<CountryOfficeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryOfficeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
