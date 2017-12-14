import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyCreateEditPreparednessComponent } from './local-agency-create-edit-preparedness.component';

describe('LocalAgencyCreateEditPreparednessComponent', () => {
  let component: LocalAgencyCreateEditPreparednessComponent;
  let fixture: ComponentFixture<LocalAgencyCreateEditPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyCreateEditPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyCreateEditPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
