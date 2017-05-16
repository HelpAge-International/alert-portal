import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapCountriesListComponent } from './map-countries-list.component';

describe('MapCountriesListComponent', () => {
  let component: MapCountriesListComponent;
  let fixture: ComponentFixture<MapCountriesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapCountriesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapCountriesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
