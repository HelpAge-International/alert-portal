import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStartFundComponent } from './export-start-fund.component';

describe('ExportStartFundComponent', () => {
  let component: ExportStartFundComponent;
  let fixture: ComponentFixture<ExportStartFundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportStartFundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportStartFundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
