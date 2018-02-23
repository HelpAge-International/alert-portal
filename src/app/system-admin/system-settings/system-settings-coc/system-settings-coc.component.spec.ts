import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsCocComponent } from './system-settings-coc.component';

describe('SystemSettingsCocComponent', () => {
  let component: SystemSettingsCocComponent;
  let fixture: ComponentFixture<SystemSettingsCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
