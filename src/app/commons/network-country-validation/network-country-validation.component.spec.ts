import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryValidationComponent } from './network-country-validation.component';

describe('NetworkCountryValidationComponent', () => {
  let component: NetworkCountryValidationComponent;
  let fixture: ComponentFixture<NetworkCountryValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
