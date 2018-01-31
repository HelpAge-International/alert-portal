import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyEquipmentComponent } from './local-agency-equipment.component';

describe('LocalAgencyEquipmentComponent', () => {
  let component: LocalAgencyEquipmentComponent;
  let fixture: ComponentFixture<LocalAgencyEquipmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyEquipmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyEquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
