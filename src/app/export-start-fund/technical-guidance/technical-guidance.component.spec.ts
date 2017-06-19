import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnicalGuidanceComponent } from './technical-guidance.component';

describe('TechnicalGuidanceComponent', () => {
  let component: TechnicalGuidanceComponent;
  let fixture: ComponentFixture<TechnicalGuidanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TechnicalGuidanceComponent ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnicalGuidanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
