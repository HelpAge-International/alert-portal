import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryCreateEditMessageComponent } from './country-create-edit-message.component';

describe('CountryCreateEditMessageComponent', () => {
  let component: CountryCreateEditMessageComponent;
  let fixture: ComponentFixture<CountryCreateEditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CountryCreateEditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CountryCreateEditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
