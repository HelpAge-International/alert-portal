import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryOfficeProfileComponent } from './country-office-profile.component';

describe('CountryOfficeProfileComponent', () => {
  let component: CountryOfficeProfileComponent;
  let fixture: ComponentFixture<CountryOfficeProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryOfficeProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryOfficeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
