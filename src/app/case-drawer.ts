import { Component, ElementRef, effect, input, output, viewChild } from '@angular/core';
import { Case } from './content';
import { CaseStudy } from './case-study';

@Component({
  selector: 'app-case-drawer',
  imports: [CaseStudy],
  template: `
    <dialog
      #dialog
      class="drawer"
      [attr.aria-labelledby]="item() ? item()!.id + '-title' : null"
      (close)="closed.emit()"
      (click)="closeOnBackdrop($event)"
    >
      <div class="panel">
        <div class="bar">
          <button type="button" class="close" (click)="dialog.close()" aria-label="Close case" title="Close (Esc)">
            <svg viewBox="0 0 20 20" width="18" height="18" aria-hidden="true">
              <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
            </svg>
          </button>
        </div>
        @if (item(); as c) {
          <app-case-study [item]="c" />
        }
      </div>
    </dialog>
  `,
  styleUrl: './case-drawer.css',
})
export class CaseDrawer {
  readonly item = input<Case | null>(null);
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const el = this.dialog().nativeElement;
      if (this.item() && !el.open) {
        el.showModal();
        el.querySelector('.panel')?.scrollTo(0, 0);
      } else if (!this.item() && el.open) {
        el.close();
      }
    });
  }

  protected closeOnBackdrop(event: MouseEvent): void {
    if (event.target === this.dialog().nativeElement) {
      this.dialog().nativeElement.close();
    }
  }
}
