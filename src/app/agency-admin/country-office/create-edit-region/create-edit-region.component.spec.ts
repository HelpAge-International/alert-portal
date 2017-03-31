import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditRegionComponent } from './create-edit-region.component';

describe('CreateEditRegionComponent', () => {
  let component: CreateEditRegionComponent;
  let fixture: ComponentFixture<CreateEditRegionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditRegionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
