import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooditemformComponent } from './fooditemform.component';

describe('FooditemformComponent', () => {
  let component: FooditemformComponent;
  let fixture: ComponentFixture<FooditemformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FooditemformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FooditemformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
