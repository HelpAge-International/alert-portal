import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminMenuComponent } from './system-admin-menu.component';

describe('SystemAdminMenuComponent', () => {
  let component: SystemAdminMenuComponent;
  let fixture: ComponentFixture<SystemAdminMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
