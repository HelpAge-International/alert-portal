import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileProgrammeComponent } from './network-country-profile-programme.component';

describe('NetworkCountryProfileProgrammeComponent', () => {
  let component: NetworkCountryProfileProgrammeComponent;
  let fixture: ComponentFixture<NetworkCountryProfileProgrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileProgrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
