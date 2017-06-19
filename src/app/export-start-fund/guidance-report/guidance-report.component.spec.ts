import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidanceReportComponent } from './guidance-report.component';

describe('GuidanceReportComponent', () => {
  let component: GuidanceReportComponent;
  let fixture: ComponentFixture<GuidanceReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidanceReportComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
