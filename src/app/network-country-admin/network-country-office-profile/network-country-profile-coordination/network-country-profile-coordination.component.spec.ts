import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileCoordinationComponent } from './network-country-profile-coordination.component';

describe('NetworkCountryProfileCoordinationComponent', () => {
  let component: NetworkCountryProfileCoordinationComponent;
  let fixture: ComponentFixture<NetworkCountryProfileCoordinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileCoordinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileCoordinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
