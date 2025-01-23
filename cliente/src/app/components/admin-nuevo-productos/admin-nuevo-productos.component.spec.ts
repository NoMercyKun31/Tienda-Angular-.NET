import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminNuevoProductosComponent } from './admin-nuevo-productos.component';

describe('AdminNuevoProductosComponent', () => {
  let component: AdminNuevoProductosComponent;
  let fixture: ComponentFixture<AdminNuevoProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNuevoProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNuevoProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
