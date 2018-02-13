import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyCreateEditResponsePlansComponent } from './local-agency-create-edit-response-plans.component';

describe('LocalAgencyCreateEditResponsePlansComponent', () => {
  let component: LocalAgencyCreateEditResponsePlansComponent;
  let fixture: ComponentFixture<LocalAgencyCreateEditResponsePlansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyCreateEditResponsePlansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyCreateEditResponsePlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
