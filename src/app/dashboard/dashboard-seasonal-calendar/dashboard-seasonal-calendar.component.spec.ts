import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSeasonalCalendarComponent } from './dashboard-seasonal-calendar.component';

describe('DashboardSeasonalCalendarComponent', () => {
  let component: DashboardSeasonalCalendarComponent;
  let fixture: ComponentFixture<DashboardSeasonalCalendarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSeasonalCalendarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSeasonalCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
