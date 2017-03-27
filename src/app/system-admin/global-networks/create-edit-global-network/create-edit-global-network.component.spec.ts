import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateEditGlobalNetworkComponent } from './create-edit-global-network.component';

describe('CreateEditGlobalNetworkComponent', () => {
  let component: CreateEditGlobalNetworkComponent;
  let fixture: ComponentFixture<CreateEditGlobalNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEditGlobalNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateEditGlobalNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
