import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyDashboardSeasonalCalendarComponent } from './local-agency-dashboard-seasonal-calendar.component';

describe('LocalAgencyDashboardSeasonalCalendarComponent', () => {
  let component: LocalAgencyDashboardSeasonalCalendarComponent;
  let fixture: ComponentFixture<LocalAgencyDashboardSeasonalCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyDashboardSeasonalCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyDashboardSeasonalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
