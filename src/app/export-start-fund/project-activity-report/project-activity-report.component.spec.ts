import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectActivityReportComponent } from './project-activity-report.component';

describe('ProjectActivityReportComponent', () => {
  let component: ProjectActivityReportComponent;
  let fixture: ComponentFixture<ProjectActivityReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectActivityReportComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectActivityReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
