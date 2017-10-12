import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileContactsComponent } from './network-country-profile-contacts.component';

describe('NetworkCountryProfileContactsComponent', () => {
  let component: NetworkCountryProfileContactsComponent;
  let fixture: ComponentFixture<NetworkCountryProfileContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
