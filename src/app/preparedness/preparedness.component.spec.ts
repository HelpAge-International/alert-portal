import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparednessComponent } from './preparedness.component';

describe('PreparednessComponent', () => {
  let component: PreparednessComponent;
  let fixture: ComponentFixture<PreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
