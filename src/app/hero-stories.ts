import { Component, DestroyRef, inject, signal } from '@angular/core';
import { BugLines } from './bug-lines';
import { heroStories } from './content';

// One run of the line animation (see bug-lines.css) plus time to read it.
const STEP_MS = 7000;

@Component({
  selector: 'app-hero-stories',
  imports: [BugLines],
  template: `
    <figure
      class="proof"
      aria-roledescription="carousel"
      aria-label="Bugs I found by running the code"
      (mouseenter)="hold(true)"
      (mouseleave)="hold(false)"
      (focusin)="hold(true)"
      (focusout)="hold(false)"
    >
      <div class="head">
        <span class="source">{{ story().source }}</span>
        <div class="controls">
          <span class="count">{{ index() + 1 }} of {{ stories.length }}</span>
          <button type="button" (click)="step(-1)" aria-label="Previous bug" title="Previous">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M12.5 4.5L7 10l5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            (click)="togglePlay()"
            [attr.aria-label]="playing() ? 'Pause' : 'Play'"
            [title]="playing() ? 'Pause' : 'Play'"
          >
            @if (playing()) {
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M7 5v10M13 5v10" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
              </svg>
            } @else {
              <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
                <path d="M7 4.8l8 5.2-8 5.2z" fill="currentColor" />
              </svg>
            }
          </button>
          <button type="button" (click)="step(1)" aria-label="Next bug" title="Next">
            <svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true">
              <path d="M7.5 4.5L13 10l-5.5 5.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      <div class="stage">
        <!-- Invisible copies of every story keep the panel at the tallest one's height. -->
        @for (s of stories; track s.id) {
          <div class="sizer" aria-hidden="true">
            <app-bug-lines [lines]="s.lines" />
            <p class="caption">{{ s.caption }}</p>
          </div>
        }
        <div class="slide" [attr.aria-live]="playing() ? 'off' : 'polite'">
          @for (s of [story()]; track s.id) {
            <app-bug-lines [lines]="s.lines" [play]="true" [label]="s.source + ' bug, fix and result'" />
            <figcaption class="caption">{{ s.caption }}</figcaption>
          }
        </div>
      </div>
    </figure>
  `,
  styleUrl: './hero-stories.css',
})
export class HeroStories {
  protected readonly stories = heroStories;
  protected readonly index = signal(0);
  protected readonly playing = signal(true);
  protected readonly story = () => this.stories[this.index()];

  private timer: ReturnType<typeof setTimeout> | undefined;
  private held = false;
  private shown = 1;

  constructor() {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      this.playing.set(false);
    } else {
      this.schedule();
    }

    const onVisibility = () => (document.hidden ? this.clear() : this.schedule());
    document.addEventListener('visibilitychange', onVisibility);
    inject(DestroyRef).onDestroy(() => {
      this.clear();
      document.removeEventListener('visibilitychange', onVisibility);
    });
  }

  protected step(direction: 1 | -1): void {
    this.playing.set(false);
    this.clear();
    this.go(direction);
  }

  protected togglePlay(): void {
    this.playing.update((p) => !p);
    if (this.playing()) {
      this.shown = 1;
      this.schedule();
    } else {
      this.clear();
    }
  }

  protected hold(on: boolean): void {
    this.held = on;
    if (on) {
      this.clear();
    } else {
      this.schedule();
    }
  }

  private go(direction: 1 | -1): void {
    const n = this.stories.length;
    this.index.update((i) => (i + direction + n) % n);
  }

  private schedule(): void {
    this.clear();
    if (!this.playing() || this.held || document.hidden) {
      return;
    }
    this.timer = setTimeout(() => {
      this.go(1);
      this.shown++;
      // Play through every story once, then stop on the first one.
      if (this.shown > this.stories.length) {
        this.playing.set(false);
        return;
      }
      this.schedule();
    }, STEP_MS);
  }

  private clear(): void {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
  }
}
