import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkAdminViewCocComponent } from './network-admin-view-coc.component';

describe('NetworkAdminViewCocComponent', () => {
  let component: NetworkAdminViewCocComponent;
  let fixture: ComponentFixture<NetworkAdminViewCocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NetworkAdminViewCocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkAdminViewCocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
