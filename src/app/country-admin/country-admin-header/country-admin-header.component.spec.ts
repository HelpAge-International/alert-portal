import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAdminHeaderComponent } from './country-admin-header.component';

describe('CountryAdminHeaderComponent', () => {
  let component: CountryAdminHeaderComponent;
  let fixture: ComponentFixture<CountryAdminHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAdminHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
