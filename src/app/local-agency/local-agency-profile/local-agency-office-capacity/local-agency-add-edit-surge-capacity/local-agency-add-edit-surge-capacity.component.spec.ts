import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditSurgeCapacityComponent } from './local-agency-add-edit-surge-capacity.component';

describe('LocalAgencyAddEditSurgeCapacityComponent', () => {
  let component: LocalAgencyAddEditSurgeCapacityComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditSurgeCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditSurgeCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditSurgeCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
