import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface EventDetails {
  title: string;
  venue: string;
  address: string;
  day: string;
  month: string;
  weekday: string;
  time: string;
  entry: string;
  reserved: string;
  lineup: string[];
}

@Component({
  selector: 'app-community-event',
  imports: [CommonModule],
  templateUrl: './community-event.html',
  styleUrl: './community-event.scss'
})
export class CommunityEventComponent {
  event: EventDetails = {
    title: 'Tardeo Remember — Fernán y Amigos',
    venue: "D'Locos Discoteca",
    address: 'C/ Argentina 20, Coslada',
    day: '28',
    month: 'NOV',
    weekday: 'Sábado',
    time: '18:00h – 02:00h',
    entry: 'Entrada gratuita',
    reserved: 'Reservados 80€',
    lineup: [
      'Fernán y Amigos',
      'Toni Rubio',
      'DJ Xaax',
      'DJ Letty',
      'Jose Negro',
      'SRP',
      'Mikev3rink',
      'DJ Sophie.B'
    ]
  };
}
