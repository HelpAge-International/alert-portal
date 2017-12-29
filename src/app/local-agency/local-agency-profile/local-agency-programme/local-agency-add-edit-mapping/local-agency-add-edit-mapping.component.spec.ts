import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalAgencyAddEditMappingComponent } from './local-agency-add-edit-mapping.component';

describe('LocalAgencyAddEditMappingComponent', () => {
  let component: LocalAgencyAddEditMappingComponent;
  let fixture: ComponentFixture<LocalAgencyAddEditMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalAgencyAddEditMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalAgencyAddEditMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
