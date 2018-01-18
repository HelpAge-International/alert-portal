import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyResponsePlansComponent } from './local-agency-response-plans.component';

describe('LocalAgencyResponsePlansComponent', () => {
  let component: LocalAgencyResponsePlansComponent;
  let fixture: ComponentFixture<LocalAgencyResponsePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyResponsePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyResponsePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
