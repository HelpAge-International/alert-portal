import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyOfficeCapacityComponent } from './local-agency-office-capacity.component';

describe('LocalAgencyOfficeCapacityComponent', () => {
  let component: LocalAgencyOfficeCapacityComponent;
  let fixture: ComponentFixture<LocalAgencyOfficeCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyOfficeCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyOfficeCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
