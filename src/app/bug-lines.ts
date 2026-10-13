import { Component, input } from '@angular/core';
import { Line } from './content';

@Component({
  selector: 'app-bug-lines',
  template: `
    <ol class="lines" [class.play]="play()" [attr.aria-label]="label()">
      @for (line of lines(); track $index) {
        <li [class]="line.kind" [style.--i]="$index">
          <span class="mark" aria-hidden="true">{{ marks[line.kind] }}</span>
          <span class="sr-only">{{ names[line.kind] }}: </span>
          <span class="text"><code>{{ line.text }}</code></span>
        </li>
      }
    </ol>
  `,
  styleUrl: './bug-lines.css',
})
export class BugLines {
  readonly lines = input.required<Line[]>();
  readonly play = input(false);
  readonly label = input('Bug, fix and result');

  protected readonly marks = { fail: '✕', fix: '+', pass: '✓' };
  protected readonly names = { fail: 'Before', fix: 'Fix', pass: 'After' };
}
