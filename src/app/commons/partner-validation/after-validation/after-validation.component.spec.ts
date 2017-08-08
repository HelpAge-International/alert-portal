import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterValidationComponent } from './after-validation.component';

describe('AfterValidationComponent', () => {
  let component: AfterValidationComponent;
  let fixture: ComponentFixture<AfterValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AfterValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
