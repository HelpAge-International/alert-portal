import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartnerValidationComponent } from './partner-validation.component';

describe('PartnerValidationComponent', () => {
  let component: PartnerValidationComponent;
  let fixture: ComponentFixture<PartnerValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PartnerValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartnerValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
