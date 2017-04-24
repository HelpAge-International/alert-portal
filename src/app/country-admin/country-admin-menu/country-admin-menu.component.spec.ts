import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAdminMenuComponent } from './country-admin-menu.component';

describe('CountryAdminMenuComponent', () => {
  let component: CountryAdminMenuComponent;
  let fixture: ComponentFixture<CountryAdminMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAdminMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
