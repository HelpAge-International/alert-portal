import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryNotificationsComponent } from './network-country-notifications.component';

describe('NetworkCountryNotificationsComponent', () => {
  let component: NetworkCountryNotificationsComponent;
  let fixture: ComponentFixture<NetworkCountryNotificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryNotificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
