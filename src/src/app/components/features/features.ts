import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-features',
  imports: [CommonModule],
  templateUrl: './features.html',
  styleUrl: './features.scss'
})
export class FeaturesComponent {
  features = [
    {
      icon: '🎚️',
      tag: 'A&R & FEEDBACK PRO',
      title: 'Salas de Feedback Privadas con A&Rs de Sellos Top',
      desc: 'Sube tus demos en WAV/MP3 antes de enviarlas a discográficas. Recibe marcas de tiempo segundo a segundo de productores consagrados e ingenieros con lanzamientos en Beatport Top 10.',
      badges: ['Spinnin Records', 'Afterlife', 'Defected', 'Armada', 'Toolroom'],
      featured: true,
      gridClass: 'bento-large'
    },
    {
      icon: '🎹',
      tag: 'SAMPLE VAULT',
      title: 'Banco Ilimitado de Stems & Presets 24-bit',
      desc: 'Miles de presets de Serum, Vital y PhasePlant creados por la comunidad. Loops afinados, baterías analógicas 808/909 y acapellas 100% libres de royalties.',
      featured: false,
      gridClass: 'bento-medium'
    },
    {
      icon: '🤝',
      tag: 'CO-PRODUCCIÓN',
      title: 'Matchmaking de Colaboradores',
      desc: 'Encuentra al vocalista perfecto para tu track de Melodic House o al co-productor para pulir el drop de tu tema Drum & Bass según tu DAW.',
      featured: false,
      gridClass: 'bento-medium'
    },
    {
      icon: '🎓',
      tag: 'ACADEMIA VIP',
      title: 'Masterclasses Semanales y Deconstrucciones de Tracks',
      desc: 'Aprende cómo los headliners crean sus leads, ecualizan sus bajos y procesan sus mezclas para sonar masivo en festivales y clubs.',
      featured: false,
      gridClass: 'bento-medium'
    },
    {
      icon: '🏆',
      tag: 'COMPETICIONES',
      title: 'Remix Contests Mensuales',
      desc: 'Descarga los stems oficiales de temas firmados en sellos internacionales. Compite por premios en sintetizadores hardware, plugins y contratos discográficos.',
      featured: false,
      gridClass: 'bento-medium'
    },
    {
      icon: '⚡',
      tag: 'SMART TOOLS',
      title: 'Analizador LUFS y Mezcla en Tiempo Real',
      desc: 'Herramientas web integradas para verificar el balance tonal, ancho estéreo y sonoridad de tu máster antes de publicar en Spotify o SoundCloud.',
      featured: false,
      gridClass: 'bento-large-alt'
    }
  ];
}
