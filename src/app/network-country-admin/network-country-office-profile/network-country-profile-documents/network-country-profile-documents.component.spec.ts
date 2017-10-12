import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkCountryProfileDocumentsComponent } from './network-country-profile-documents.component';

describe('NetworkCountryProfileDocumentsComponent', () => {
  let component: NetworkCountryProfileDocumentsComponent;
  let fixture: ComponentFixture<NetworkCountryProfileDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkCountryProfileDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkCountryProfileDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
