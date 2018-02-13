import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyDocumentsComponent } from './local-agency-documents.component';

describe('LocalAgencyDocumentsComponent', () => {
  let component: LocalAgencyDocumentsComponent;
  let fixture: ComponentFixture<LocalAgencyDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
