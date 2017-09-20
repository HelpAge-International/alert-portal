import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkAdminDashboardComponent } from './local-network-admin-dashboard.component';

describe('LocalNetworkAdminDashboardComponent', () => {
  let component: LocalNetworkAdminDashboardComponent;
  let fixture: ComponentFixture<LocalNetworkAdminDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkAdminDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
