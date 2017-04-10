import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsPreparednessComponent } from './system-settings-preparedness.component';

describe('SystemSettingsPreparednessComponent', () => {
  let component: SystemSettingsPreparednessComponent;
  let fixture: ComponentFixture<SystemSettingsPreparednessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsPreparednessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsPreparednessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
