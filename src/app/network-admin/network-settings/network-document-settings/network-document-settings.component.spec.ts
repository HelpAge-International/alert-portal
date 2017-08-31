import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDocumentSettingsComponent } from './network-document-settings.component';

describe('NetworkDocumentSettingsComponent', () => {
  let component: NetworkDocumentSettingsComponent;
  let fixture: ComponentFixture<NetworkDocumentSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkDocumentSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkDocumentSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
