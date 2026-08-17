import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  imports: [CommonModule],
  templateUrl: './faq.html',
  styleUrl: './faq.scss'
})
export class FaqComponent {
  openItem = signal<number | null>(1);

  faqs: FaqItem[] = [
    {
      id: 1,
      question: '¿Qué nivel de producción necesito para unirme a COMMUNITY?',
      answer: 'Cualquier nivel es bienvenido. Contamos con salas categorizadas desde fundamentos de DAW, diseño sonoro básico y teoría musical, hasta salas avanzadas de mezcla estéreo/Dolby Atmos, deconstrucciones de drops para festivales y conexión con A&Rs de sellos internacionales.'
    },
    {
      id: 2,
      question: '¿Qué DAWs y sintetizadores son compatibles con la comunidad?',
      answer: 'Soportamos todos los DAWs estándar de la industria: Ableton Live (11 & 12), FL Studio (21 & 24), Logic Pro, Cubase, Studio One, Reaper y Bitwig. En cuanto a sintetizadores, compartimos miles de presets para Serum, Vital, PhasePlant, Diva, Spire, Pigments y Nexus, así como racks nativos.'
    },
    {
      id: 3,
      question: '¿Cómo funcionan las salas de feedback y las sesiones con A&Rs?',
      answer: 'Subes el archivo de audio o enlace privado de tu demo (SoundCloud/Dropbox/Drive). La comunidad y los A&Rs asociados escuchan tu track y añaden comentarios con marca de tiempo precisa (ej: 01:24 "el kick pierde pegada en la transición"). Los temas con mejores valoraciones entran en las sesiones de escucha en vivo de sellos discográficos asociados.'
    },
    {
      id: 4,
      question: '¿Los sample packs y stems del Vault son libres de derechos (Royalty-Free)?',
      answer: 'Sí, el 100% de los loops, samples a 24-bit y presets generados para el Vault oficial de COMMUNITY son 100% Royalty-Free. Puedes usarlos libremente en tus lanzamientos comerciales en Spotify, Apple Music, Beatport o sets en directo sin necesidad de pagar regalías.'
    },
    {
      id: 5,
      question: '¿Cómo accedo a las masterclasses en vivo y qué ocurre si me pierdo una?',
      answer: 'Todas las masterclasses se transmiten en directo a través de nuestra plataforma con chat interactivo en tiempo real para preguntas y respuestas. Si no puedes asistir en directo, todas las sesiones quedan grabadas en calidad 4K/Audio lossless en la videoteca VIP para que las repases a tu propio ritmo.'
    }
  ];

  toggleFaq(id: number) {
    this.openItem.update(current => (current === id ? null : id));
  }
}
