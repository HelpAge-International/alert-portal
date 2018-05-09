import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminViewCocComponent } from './system-admin-view-coc.component';

describe('SystemAdminViewCocComponent', () => {
  let component: SystemAdminViewCocComponent;
  let fixture: ComponentFixture<SystemAdminViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
