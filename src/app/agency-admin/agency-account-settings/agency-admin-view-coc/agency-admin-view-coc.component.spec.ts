import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgencyAdminViewCocComponent } from './agency-admin-view-coc.component';

describe('AgencyAdminViewCocComponent', () => {
  let component: AgencyAdminViewCocComponent;
  let fixture: ComponentFixture<AgencyAdminViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgencyAdminViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgencyAdminViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
