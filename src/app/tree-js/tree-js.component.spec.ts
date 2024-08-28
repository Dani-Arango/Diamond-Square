import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeJsComponent } from './tree-js.component';

describe('TreeJsComponent', () => {
  let component: TreeJsComponent;
  let fixture: ComponentFixture<TreeJsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeJsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeJsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
