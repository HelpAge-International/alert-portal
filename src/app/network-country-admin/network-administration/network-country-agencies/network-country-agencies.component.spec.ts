import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryAgenciesComponent } from './network-country-agencies.component';

describe('NetworkCountryAgenciesComponent', () => {
  let component: NetworkCountryAgenciesComponent;
  let fixture: ComponentFixture<NetworkCountryAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
