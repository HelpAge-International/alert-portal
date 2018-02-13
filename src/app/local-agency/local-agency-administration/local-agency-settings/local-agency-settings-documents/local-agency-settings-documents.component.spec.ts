import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencySettingsDocumentsComponent } from './local-agency-settings-documents.component';

describe('LocalAgencySettingsDocumentsComponent', () => {
  let component: LocalAgencySettingsDocumentsComponent;
  let fixture: ComponentFixture<LocalAgencySettingsDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencySettingsDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencySettingsDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
