import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryAddExternalRecipientComponent } from './country-add-external-recipient.component';

describe('CountryAddExternalRecipientComponent', () => {
  let component: CountryAddExternalRecipientComponent;
  let fixture: ComponentFixture<CountryAddExternalRecipientComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryAddExternalRecipientComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryAddExternalRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
