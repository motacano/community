import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero',
  imports: [CommonModule],
  templateUrl: './hero.html',
  styleUrl: './hero.scss'
})
export class HeroComponent {
  featuredEvent = {
    flyer: 'assets/images/dlocos-flyer.jpg',
    title: 'Tardeo Remember — Fernán y Amigos',
    venue: "D'Locos Discoteca",
    date: 'Sábado 28 NOV · 18:00h – 02:00h'
  };

  equalizerBars = Array.from({ length: 32 }, (_, i) => ({
    delay: `${(i * 0.08).toFixed(2)}s`,
    duration: `${(0.6 + Math.random() * 0.8).toFixed(2)}s`,
    maxHeight: `${30 + Math.floor(Math.random() * 70)}%`
  }));
}
