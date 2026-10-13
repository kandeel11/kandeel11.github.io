import { Component, input } from '@angular/core';
import { Case } from './content';
import { BugLines } from './bug-lines';
import { CaseShots } from './case-shots';

@Component({
  selector: 'app-case-study',
  imports: [BugLines, CaseShots],
  template: `
    @let c = item();
    <article class="case" [attr.aria-labelledby]="c.id + '-title'">
      <header class="head">
        <h3 [id]="c.id + '-title'">{{ c.name }}</h3>
        <p class="context">{{ c.context }}</p>
      </header>

      <p class="summary">{{ c.summary }}</p>

      @if (c.shots?.length) {
        @if (c.shotsSource) {
          <app-case-shots [shots]="c.shots!" [label]="c.name" [source]="c.shotsSource" />
        } @else {
          <app-case-shots [shots]="c.shots!" [label]="c.name" />
        }
      }

      @if (c.problem) {
        <p><strong>The problem.</strong> {{ c.problem }}</p>
      }

      @if (c.did.length) {
        <p class="did-title"><strong>What I did.</strong></p>
        <ul class="did">
          @for (point of c.did; track $index) {
            <li>{{ point }}</li>
          }
        </ul>
      }

      @if (c.story) {
        <figure class="story">
          <app-bug-lines [lines]="c.story.lines" [label]="c.name + ' bug, fix and result'" />
          <figcaption>{{ c.story.caption }}</figcaption>
        </figure>
      }

      @if (c.note) {
        <p class="note">{{ c.note }}</p>
      }

      <p class="foot">
        <span class="stack">Built with {{ c.stack }}.</span>
        @if (c.live) {
          <a [href]="c.live" target="_blank" rel="noopener">Live site</a>
        }
        @if (c.repo) {
          <a [href]="c.repo" target="_blank" rel="noopener">Code on GitHub</a>
        }
      </p>
    </article>
  `,
  styleUrl: './case-study.css',
})
export class CaseStudy {
  readonly item = input.required<Case>();
}
