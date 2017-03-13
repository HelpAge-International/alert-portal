import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAdminHeaderComponent } from './system-admin-header.component';

describe('SystemAdminHeaderComponent', () => {
  let component: SystemAdminHeaderComponent;
  let fixture: ComponentFixture<SystemAdminHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SystemAdminHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAdminHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
