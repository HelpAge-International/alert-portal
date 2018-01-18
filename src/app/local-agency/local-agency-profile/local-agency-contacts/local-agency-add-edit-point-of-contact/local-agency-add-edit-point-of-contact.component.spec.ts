import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditPointOfContactComponent } from './local-agency-add-edit-point-of-contact.component';

describe('LocalAgencyAddEditPointOfContactComponent', () => {
  let component: LocalAgencyAddEditPointOfContactComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditPointOfContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditPointOfContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditPointOfContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
