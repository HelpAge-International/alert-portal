import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditNetworkComponent } from './create-edit-network.component';

describe('CreateEditNetworkComponent', () => {
  let component: CreateEditNetworkComponent;
  let fixture: ComponentFixture<CreateEditNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
