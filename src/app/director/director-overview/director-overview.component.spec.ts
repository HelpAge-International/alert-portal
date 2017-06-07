import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectorOverviewComponent } from './director-overview.component';

describe('DirectorOverviewComponent', () => {
  let component: DirectorOverviewComponent;
  let fixture: ComponentFixture<DirectorOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectorOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectorOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
