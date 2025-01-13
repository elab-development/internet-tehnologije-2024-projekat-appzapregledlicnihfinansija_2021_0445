import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {

  // constructor(@Inject(PLATFORM_ID) private platformId: any) { }

  // ngOnInit(): void {
  //   this.loadTheme(); // Ensure theme is loaded when component is initialized
  // }

  // setTheme(theme: string): void {
  //   const body = document.body;

  //   if (theme === 'dark') {
  //     body.classList.add('dark-theme');
  //     body.classList.remove('light-theme');
  //   } else {
  //     body.classList.add('light-theme');
  //     body.classList.remove('dark-theme');
  //   }

  //   if (isPlatformBrowser(this.platformId)) {
  //     localStorage.setItem('theme', theme); // Save the selected theme (only in browser)
  //   }
  // }

  // loadTheme() {
  //   if (isPlatformBrowser(this.platformId)) {
  //     const savedTheme = localStorage.getItem('theme');
  //     if (savedTheme) {
  //       this.setTheme(savedTheme);  // Apply saved theme (light or dark)
  //     } else {
  //       this.setTheme('light');  // Default to light theme if no preference is saved
  //     }
  //   }
  // }

}
