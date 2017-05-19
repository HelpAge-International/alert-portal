import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountrySubmenuComponent } from './country-submenu.component';

describe('CountrySubmenuComponent', () => {
  let component: CountrySubmenuComponent;
  let fixture: ComponentFixture<CountrySubmenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountrySubmenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountrySubmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
