import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardUpdateAlertLevelComponent } from './dashboard-update-alert-level.component';

describe('DashboardUpdateAlertLevelComponent', () => {
  let component: DashboardUpdateAlertLevelComponent;
  let fixture: ComponentFixture<DashboardUpdateAlertLevelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardUpdateAlertLevelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardUpdateAlertLevelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
