import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileOfficeCapacityComponent } from './local-network-profile-office-capacity.component';

describe('LocalNetworkProfileOfficeCapacityComponent', () => {
  let component: LocalNetworkProfileOfficeCapacityComponent;
  let fixture: ComponentFixture<LocalNetworkProfileOfficeCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileOfficeCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileOfficeCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
