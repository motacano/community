import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cta-banner',
  imports: [CommonModule, FormsModule],
  templateUrl: './cta-banner.html',
  styleUrl: './cta-banner.scss'
})
export class CtaBannerComponent {
  email = signal('');
  genre = signal('Melodic Techno');
  isSubmitted = signal(false);

  genres = ['Melodic Techno', 'Tech House', 'Afro House', 'Drum & Bass', 'Trance & Psy', 'Dubstep & Bass Music', 'Deep House'];

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.email().trim()) {
      this.isSubmitted.set(true);
    }
  }

  resetForm() {
    this.email.set('');
    this.isSubmitted.set(false);
  }
}
