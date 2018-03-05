import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCountriesComponent } from './view-countries.component';

describe('ViewCountriesComponent', () => {
  let component: ViewCountriesComponent;
  let fixture: ComponentFixture<ViewCountriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCountriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCountriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
