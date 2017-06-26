import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingDatasheetComponent } from './reporting-datasheet.component';

describe('ReportingDatasheetComponent', () => {
  let component: ReportingDatasheetComponent;
  let fixture: ComponentFixture<ReportingDatasheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingDatasheetComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingDatasheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
