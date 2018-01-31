import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyContactsComponent } from './local-agency-contacts.component';

describe('LocalAgencyContactsComponent', () => {
  let component: LocalAgencyContactsComponent;
  let fixture: ComponentFixture<LocalAgencyContactsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyContactsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyContactsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
