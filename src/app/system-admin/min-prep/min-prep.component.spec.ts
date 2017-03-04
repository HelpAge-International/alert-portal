import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MinPrepComponent } from './min-prep.component';

describe('MinPrepComponent', () => {
  let component: MinPrepComponent;
  let fixture: ComponentFixture<MinPrepComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MinPrepComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MinPrepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
