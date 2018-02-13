import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAccountDetailsComponent } from './local-agency-account-details.component';

describe('LocalAgencyAccountDetailsComponent', () => {
  let component: LocalAgencyAccountDetailsComponent;
  let fixture: ComponentFixture<LocalAgencyAccountDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAccountDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
