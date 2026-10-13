import { Component, OnInit, signal } from '@angular/core';
import { CaseCard } from './case-card';
import { CaseDrawer } from './case-drawer';
import { Case, projects, skills, timeline, work } from './content';
import { HeroStories } from './hero-stories';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-root',
  imports: [CaseCard, CaseDrawer, HeroStories],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly work = work;
  protected readonly projects = projects;
  protected readonly skills = skills;
  protected readonly timeline = timeline;
  protected readonly cv = 'Mohamed_Khaled_Mahmoud_DotNet_Developer_CV.pdf';
  protected readonly email = 'kandeelmohamed241@gmail.com';

  protected readonly selected = signal<Case | null>(null);
  protected readonly theme = signal<Theme>(
    document.documentElement.dataset['theme'] === 'dark' ? 'dark' : 'light',
  );

  ngOnInit(): void {
    const id = location.hash.slice(1);
    const match = [...work, ...projects].find((c) => c.id === id && c.did.length);
    if (match) {
      this.selected.set(match);
    }
  }

  protected openCase(item: Case): void {
    this.selected.set(item);
    history.replaceState(null, '', '#' + item.id);
  }

  protected closeCase(): void {
    this.selected.set(null);
    history.replaceState(null, '', location.pathname + location.search);
  }

  protected toggleTheme(): void {
    const next: Theme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(next);
    document.documentElement.dataset['theme'] = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Storage can be blocked; the toggle still works for this visit.
    }
  }
}
