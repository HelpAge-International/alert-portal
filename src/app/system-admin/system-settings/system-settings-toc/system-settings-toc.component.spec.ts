import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsTocComponent } from './system-settings-toc.component';

describe('SystemSettingsTocComponent', () => {
  let component: SystemSettingsTocComponent;
  let fixture: ComponentFixture<SystemSettingsTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
