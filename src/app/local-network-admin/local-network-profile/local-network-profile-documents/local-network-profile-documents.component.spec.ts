import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalNetworkProfileDocumentsComponent } from './local-network-profile-documents.component';

describe('LocalNetworkProfileDocumentsComponent', () => {
  let component: LocalNetworkProfileDocumentsComponent;
  let fixture: ComponentFixture<LocalNetworkProfileDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalNetworkProfileDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalNetworkProfileDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
