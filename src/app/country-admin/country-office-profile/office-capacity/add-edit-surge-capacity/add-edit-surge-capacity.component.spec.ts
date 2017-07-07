import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSurgeCapacityComponent } from './add-edit-surge-capacity.component';

describe('AddEditSurgeCapacityComponent', () => {
  let component: AddEditSurgeCapacityComponent;
  let fixture: ComponentFixture<AddEditSurgeCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditSurgeCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSurgeCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
