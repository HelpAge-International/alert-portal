import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAdminViewTocComponent } from './agency-admin-view-toc.component';

describe('AgencyAdminViewTocComponent', () => {
  let component: AgencyAdminViewTocComponent;
  let fixture: ComponentFixture<AgencyAdminViewTocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAdminViewTocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAdminViewTocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
