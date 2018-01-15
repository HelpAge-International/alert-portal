import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyCreateEditMessageComponent } from './local-agency-create-edit-message.component';

describe('LocalAgencyCreateEditMessageComponent', () => {
  let component: LocalAgencyCreateEditMessageComponent;
  let fixture: ComponentFixture<LocalAgencyCreateEditMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyCreateEditMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyCreateEditMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
