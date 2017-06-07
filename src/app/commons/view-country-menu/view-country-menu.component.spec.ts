import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCountryMenuComponent } from './view-country-menu.component';

describe('ViewCountryMenuComponent', () => {
  let component: ViewCountryMenuComponent;
  let fixture: ComponentFixture<ViewCountryMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCountryMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCountryMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
