import { Component, input, output } from '@angular/core';
import { Case } from './content';

@Component({
  selector: 'app-case-card',
  template: `
    @let c = item();
    <article
      class="card"
      [class.large]="large()"
      [class.wide]="wide() && !!c.shots?.length"
      [attr.aria-labelledby]="c.id + '-card-title'"
    >
      @if (c.shots?.length) {
        <img class="cover" [src]="c.shots![0].src" alt="" width="1440" height="900" loading="lazy" decoding="async" />
      }
      <div class="body">
        <p class="context">{{ c.context }}</p>
        <h3 [id]="c.id + '-card-title'">{{ c.name }}</h3>
        <p class="highlight">{{ c.highlight }}</p>
        @if (large() || wide()) {
          <p class="summary">{{ c.summary }}</p>
        }
        <p class="tags">{{ c.tags }}</p>
        <div class="actions">
          @if (c.did.length) {
            <button type="button" class="open" (click)="open.emit(c)" [attr.aria-haspopup]="'dialog'">
              Read the case
            </button>
          }
          @if (c.live) {
            <a class="repo" [href]="c.live" target="_blank" rel="noopener">Live site</a>
          }
          @if (c.repo) {
            <a class="repo" [href]="c.repo" target="_blank" rel="noopener">GitHub</a>
          }
        </div>
      </div>
    </article>
  `,
  styleUrl: './case-card.css',
})
export class CaseCard {
  readonly item = input.required<Case>();
  readonly large = input(false);
  /** Spans a full grid row: the screenshot sits beside the text instead of above it. */
  readonly wide = input(false);
  readonly open = output<Case>();
}
