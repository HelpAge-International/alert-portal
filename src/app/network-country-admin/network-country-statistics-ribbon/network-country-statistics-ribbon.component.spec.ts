import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryStatisticsRibbonComponent } from './network-country-statistics-ribbon.component';

describe('NetworkCountryStatisticsRibbonComponent', () => {
  let component: NetworkCountryStatisticsRibbonComponent;
  let fixture: ComponentFixture<NetworkCountryStatisticsRibbonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryStatisticsRibbonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryStatisticsRibbonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
