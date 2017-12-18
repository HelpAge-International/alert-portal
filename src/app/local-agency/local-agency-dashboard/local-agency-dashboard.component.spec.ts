import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyDashboardComponent } from './local-agency-dashboard.component';

describe('LocalAgencyDashboardComponent', () => {
  let component: LocalAgencyDashboardComponent;
  let fixture: ComponentFixture<LocalAgencyDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
