import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageitemsComponent } from './manageitems.component';

describe('ManageitemsComponent', () => {
  let component: ManageitemsComponent;
  let fixture: ComponentFixture<ManageitemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ManageitemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageitemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
