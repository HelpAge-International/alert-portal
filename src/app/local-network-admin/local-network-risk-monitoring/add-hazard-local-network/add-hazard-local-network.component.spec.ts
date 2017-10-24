import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHazardLocalNetworkComponent } from './add-hazard-local-network.component';

describe('AddHazardLocalNetworkComponent', () => {
  let component: AddHazardLocalNetworkComponent;
  let fixture: ComponentFixture<AddHazardLocalNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHazardLocalNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHazardLocalNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
