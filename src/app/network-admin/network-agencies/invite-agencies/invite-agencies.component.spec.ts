import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteAgenciesComponent } from './invite-agencies.component';

describe('InviteAgenciesComponent', () => {
  let component: InviteAgenciesComponent;
  let fixture: ComponentFixture<InviteAgenciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteAgenciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteAgenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
