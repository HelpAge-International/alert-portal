import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditSurgeEquipmentComponent } from './local-agency-add-edit-surge-equipment.component';

describe('LocalAgencyAddEditSurgeEquipmentComponent', () => {
  let component: LocalAgencyAddEditSurgeEquipmentComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditSurgeEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditSurgeEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditSurgeEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
