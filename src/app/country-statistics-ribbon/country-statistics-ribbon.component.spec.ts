import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStatisticsRibbonComponent } from './country-statistics-ribbon.component';

describe('CountryStatisticsComponent', () => {
  let component: CountryStatisticsRibbonComponent;
  let fixture: ComponentFixture<CountryStatisticsRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryStatisticsRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryStatisticsRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
