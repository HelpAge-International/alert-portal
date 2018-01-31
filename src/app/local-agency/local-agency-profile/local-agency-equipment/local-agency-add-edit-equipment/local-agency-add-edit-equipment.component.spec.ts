import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditEquipmentComponent } from './local-agency-add-edit-equipment.component';

describe('LocalAgencyAddEditEquipmentComponent', () => {
  let component: LocalAgencyAddEditEquipmentComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
