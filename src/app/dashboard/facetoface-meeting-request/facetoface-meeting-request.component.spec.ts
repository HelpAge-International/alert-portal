import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetofaceMeetingRequestComponent } from './facetoface-meeting-request.component';

describe('FacetofaceMeetingRequestComponent', () => {
  let component: FacetofaceMeetingRequestComponent;
  let fixture: ComponentFixture<FacetofaceMeetingRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacetofaceMeetingRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetofaceMeetingRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
