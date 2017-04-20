import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemSettingsDocumentsComponent } from './system-settings-documents.component';

describe('SystemSettingsDocumentsComponent', () => {
  let component: SystemSettingsDocumentsComponent;
  let fixture: ComponentFixture<SystemSettingsDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemSettingsDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemSettingsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
