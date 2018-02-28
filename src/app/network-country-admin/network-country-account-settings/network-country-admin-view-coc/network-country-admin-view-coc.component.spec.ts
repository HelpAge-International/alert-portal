import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryAdminViewCocComponent } from './network-country-admin-view-coc.component';

describe('NetworkCountryAdminViewCocComponent', () => {
  let component: NetworkCountryAdminViewCocComponent;
  let fixture: ComponentFixture<NetworkCountryAdminViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryAdminViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryAdminViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
