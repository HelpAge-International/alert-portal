import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyStatisticsRibbonComponent } from './local-agency-statistics-ribbon.component';

describe('LocalAgencyStatisticsRibbonComponent', () => {
  let component: LocalAgencyStatisticsRibbonComponent;
  let fixture: ComponentFixture<LocalAgencyStatisticsRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyStatisticsRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyStatisticsRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
