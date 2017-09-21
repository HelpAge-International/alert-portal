import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfilePartnersComponent } from './local-network-profile-partners.component';

describe('LocalNetworkProfilePartnersComponent', () => {
  let component: LocalNetworkProfilePartnersComponent;
  let fixture: ComponentFixture<LocalNetworkProfilePartnersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfilePartnersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfilePartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
