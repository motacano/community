import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
  equalizerBars = Array.from({ length: 32 }, (_, i) => ({
    delay: `${(i * 0.08).toFixed(2)}s`,
    duration: `${(0.6 + Math.random() * 0.8).toFixed(2)}s`,
    maxHeight: `${30 + Math.floor(Math.random() * 70)}%`
  }));
}
