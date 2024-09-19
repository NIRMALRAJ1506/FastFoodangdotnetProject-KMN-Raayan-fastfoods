import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrderConfirmComponent } from './admin-order-confirm.component';

describe('AdminOrderConfirmComponent', () => {
  let component: AdminOrderConfirmComponent;
  let fixture: ComponentFixture<AdminOrderConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdminOrderConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrderConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
