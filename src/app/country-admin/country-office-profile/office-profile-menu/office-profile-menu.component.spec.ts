import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryOfficeProfileMenuComponent } from './office-profile-menu.component';

describe('CountryOfficeProfileMenuComponent', () => {
  let component: CountryOfficeProfileMenuComponent;
  let fixture: ComponentFixture<CountryOfficeProfileMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryOfficeProfileMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryOfficeProfileMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
