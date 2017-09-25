import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountrySelectAgenciesComponent } from './network-country-select-agencies.component';

describe('NetworkCountrySelectAgenciesComponent', () => {
  let component: NetworkCountrySelectAgenciesComponent;
  let fixture: ComponentFixture<NetworkCountrySelectAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountrySelectAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountrySelectAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
