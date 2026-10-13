import { Component, computed, input, linkedSignal } from '@angular/core';
import { Shot } from './content';

@Component({
  selector: 'app-case-shots',
  template: `
    @let s = current();
    <figure class="shots">
      <a class="main" [href]="s.src" target="_blank" rel="noopener" title="Open full size">
        <img [src]="s.src" [alt]="s.alt" width="1440" height="900" decoding="async" />
      </a>
      <figcaption>{{ s.caption }}</figcaption>

      @if (shots().length > 1) {
        <div class="thumbs" role="group" [attr.aria-label]="label() + ' screens'">
          @for (shot of shots(); track shot.src) {
            <button
              type="button"
              [attr.aria-pressed]="$index === index()"
              [attr.aria-label]="'Screen ' + ($index + 1) + ': ' + shot.alt"
              (click)="index.set($index)"
            >
              <img [src]="shot.src" alt="" width="1440" height="900" loading="lazy" decoding="async" />
            </button>
          }
        </div>
      }
      <p class="source">{{ source() }}</p>
    </figure>
  `,
  styleUrl: './case-shots.css',
})
export class CaseShots {
  readonly shots = input.required<Shot[]>();
  readonly label = input('Project');
  readonly source = input('Screens from a local run with seed data.');
  // Back to the first screen whenever a different project's shots come in.
  protected readonly index = linkedSignal({ source: this.shots, computation: () => 0 });
  protected readonly current = computed(() => this.shots()[Math.min(this.index(), this.shots().length - 1)]);
}
