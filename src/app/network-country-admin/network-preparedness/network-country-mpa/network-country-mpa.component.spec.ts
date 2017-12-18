import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryMpaComponent } from './network-country-mpa.component';

describe('NetworkCountryMpaComponent', () => {
  let component: NetworkCountryMpaComponent;
  let fixture: ComponentFixture<NetworkCountryMpaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryMpaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryMpaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
