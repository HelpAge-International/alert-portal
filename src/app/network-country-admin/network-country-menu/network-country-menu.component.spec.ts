import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryMenuComponent } from './network-country-menu.component';

describe('NetworkCountryMenuComponent', () => {
  let component: NetworkCountryMenuComponent;
  let fixture: ComponentFixture<NetworkCountryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
