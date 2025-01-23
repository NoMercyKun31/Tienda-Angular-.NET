import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListadolanzamientosComponent } from './listadolanzamientos.component';

describe('ListadolanzamientosComponent', () => {
  let component: ListadolanzamientosComponent;
  let fixture: ComponentFixture<ListadolanzamientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListadolanzamientosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListadolanzamientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
