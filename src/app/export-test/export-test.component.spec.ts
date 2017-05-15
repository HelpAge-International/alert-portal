import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTestComponent } from './export-test.component';

describe('ExportTestComponent', () => {
  let component: ExportTestComponent;
  let fixture: ComponentFixture<ExportTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
