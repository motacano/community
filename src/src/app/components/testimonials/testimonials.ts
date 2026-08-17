import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonials',
  imports: [CommonModule],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.scss'
})
export class TestimonialsComponent {
  reviews = [
    {
      name: 'Matías Silva (DJ & Producer)',
      role: 'Firmado en Spinnin’ Deep',
      avatar: 'M',
      color: '#eab308',
      quote: 'Gracias a los feedbacks detallados de los A&Rs en la plataforma pulí la mezcla de mi track "Vortex" y en menos de 3 semanas ya estaba firmado y sonando en los sets de Tulum.',
      label: 'Spinnin Records',
      rating: 5
    },
    {
      name: 'Valeria Gómez',
      role: 'Residente en Ushuaïa Ibiza & Productora',
      avatar: 'V',
      color: '#c084fc',
      quote: 'El Preset Vault para Serum y los stems a 24-bit son una mina de oro. El nivel de los productores en los canales de Melodic Techno es de los más altos que he visto.',
      label: 'Afterlife Collab',
      rating: 5
    },
    {
      name: 'David Krüger',
      role: 'Audio Engineer & Drum & Bass Producer',
      avatar: 'D',
      color: '#38bdf8',
      quote: 'Las masterclasses deconstruyendo tracks de festivales me ahorraron años de prueba y error. El punch que ahora tienen mis baterías de club es brutal.',
      label: 'Hospital Records',
      rating: 5
    }
  ];
}
