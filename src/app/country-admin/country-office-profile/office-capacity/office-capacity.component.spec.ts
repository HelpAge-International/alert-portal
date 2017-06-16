import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAddEditPartnerComponent } from './country-add-edit-partner.component';

describe('CountryAddEditPartnerComponent', () => {
  let component: CountryAddEditPartnerComponent;
  let fixture: ComponentFixture<CountryAddEditPartnerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAddEditPartnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAddEditPartnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
