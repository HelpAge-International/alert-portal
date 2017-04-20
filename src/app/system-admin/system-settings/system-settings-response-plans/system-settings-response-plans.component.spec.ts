import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsResponsePlansComponent } from './system-settings-response-plans.component';

describe('SystemSettingsResponsePlansComponent', () => {
  let component: SystemSettingsResponsePlansComponent;
  let fixture: ComponentFixture<SystemSettingsResponsePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsResponsePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsResponsePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
