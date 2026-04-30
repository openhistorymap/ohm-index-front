import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  private readonly theme = inject(ThemeService);
  private readonly router = inject(Router);

  readonly themePreference = this.theme.current;
  readonly themeLabel = computed(() => {
    const pref = this.themePreference();
    if (pref === 'light') return 'Light theme';
    if (pref === 'dark') return 'Dark theme';
    return 'Theme follows system';
  });
  readonly themeGlyph = computed(() => {
    const pref = this.themePreference();
    if (pref === 'light') return '☼';
    if (pref === 'dark') return '☾';
    return '◐';
  });

  toggleTheme() {
    this.theme.cycle();
  }

  go(path: string) {
    this.router.navigateByUrl(path);
  }
}
