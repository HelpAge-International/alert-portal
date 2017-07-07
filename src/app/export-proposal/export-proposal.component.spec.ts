import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportProposalComponent } from './export-proposal.component';

describe('ExportProposalComponent', () => {
  let component: ExportProposalComponent;
  let fixture: ComponentFixture<ExportProposalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportProposalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportProposalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
