import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAdminComponent } from './country-admin.component';

describe('CountryAdminComponent', () => {
  let component: CountryAdminComponent;
  let fixture: ComponentFixture<CountryAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
