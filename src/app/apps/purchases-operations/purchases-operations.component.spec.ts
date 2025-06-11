import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesOperationsComponent } from './purchases-operations.component';

describe('PurchasesOperationsComponent', () => {
  let component: PurchasesOperationsComponent;
  let fixture: ComponentFixture<PurchasesOperationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesOperationsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesOperationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
