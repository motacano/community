import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

interface DemoTrack {
  id: number;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key: string;
  daw: string;
  feedbackCount: number;
  rating: number;
  isPlaying: boolean;
}

interface PresetItem {
  id: number;
  name: string;
  synth: string;
  category: string;
  downloads: number;
  author: string;
}

interface EventItem {
  id: number;
  title: string;
  speaker: string;
  role: string;
  date: string;
  time: string;
  attendees: number;
  isRegistered: boolean;
}

interface TopProducer {
  rank: number;
  name: string;
  handle: string;
  specialty: string;
  tracksSubmitted: number;
  reputationXp: number;
  isOnline: boolean;
}

@Component({
  selector: 'app-interactive-preview',
  imports: [CommonModule],
  templateUrl: './interactive-preview.html',
  styleUrl: './interactive-preview.scss'
})
export class InteractivePreviewComponent {
  activeTab = signal<'demos' | 'vault' | 'events' | 'leaderboard'>('demos');

  demoTracks = signal<DemoTrack[]>([
    { id: 1, title: 'Solaris [Original Club Mix]', artist: 'Kaelen Vance', genre: 'Melodic Techno', bpm: 126, key: 'F min', daw: 'Ableton 12', feedbackCount: 38, rating: 4.9, isPlaying: false },
    { id: 2, title: 'After Midnight (Extended)', artist: 'Elena Cruz (DJ Luna)', genre: 'Tech House', bpm: 128, key: 'A min', daw: 'FL Studio 24', feedbackCount: 24, rating: 4.8, isPlaying: false },
    { id: 3, title: 'Subatomic Pulse', artist: 'Synaptic Noise', genre: 'Drum & Bass', bpm: 174, key: 'E min', daw: 'Logic Pro', feedbackCount: 42, rating: 5.0, isPlaying: false },
    { id: 4, title: 'Oasis Mirage', artist: 'Amira Ben', genre: 'Afro House', bpm: 122, key: 'D min', daw: 'Ableton 12', feedbackCount: 19, rating: 4.7, isPlaying: false }
  ]);

  presets = signal<PresetItem[]>([
    { id: 1, name: 'Anjuna Style Pluck 2026', synth: 'Serum', category: 'Plucks & Leads', downloads: 1420, author: 'Kaelen' },
    { id: 2, name: 'Tale of Us Modular Bassline', synth: 'Vital', category: 'Sub & Bass', downloads: 2890, author: 'Modulor' },
    { id: 3, name: 'Punchy 909 Analog Kick Pack', synth: 'WAV 24-bit', category: 'Drums', downloads: 4150, author: 'AudioLab' },
    { id: 4, name: 'Cyber 303 Acid Screamer', synth: 'Serum', category: 'Acid Leads', downloads: 980, author: 'AcidHead' }
  ]);

  events = signal<EventItem[]>([
    { id: 1, title: 'Masterclass: Mezcla & Saturation en Baterías para Club', speaker: 'Marcus Vance', role: 'Ingeniero de Sonido & Productor Defected', date: 'Jueves, 20:00 CEST', time: 'En 3 días', attendees: 480, isRegistered: false },
    { id: 2, title: 'A&R Live Listening Session: Envía tu Demo', speaker: 'Sarah Lindqvist', role: 'Head of A&R en Nordic Waves / Armada sublabel', date: 'Sábado, 19:00 CEST', time: 'En 5 días', attendees: 620, isRegistered: false },
    { id: 3, title: 'Deconstrucción de Track: De la Idea al Beatport #1', speaker: 'Axel Thorne', role: 'DJ Residente en Ibiza & Productor Top 10', date: 'Martes, 21:00 CEST', time: 'En 8 días', attendees: 340, isRegistered: false }
  ]);

  topProducers = signal<TopProducer[]>([
    { rank: 1, name: 'Kaelen Vance', handle: '@kaelen_music', specialty: 'Melodic Techno / Ableton', tracksSubmitted: 48, reputationXp: 18450, isOnline: true },
    { rank: 2, name: 'Elena Cruz', handle: '@dj_luna_tech', specialty: 'Tech House / FL Studio', tracksSubmitted: 36, reputationXp: 14200, isOnline: true },
    { rank: 3, name: 'Synaptic Noise', handle: '@synaptic_dnb', specialty: 'Drum & Bass / Sound Design', tracksSubmitted: 29, reputationXp: 12900, isOnline: false },
    { rank: 4, name: 'Amira Ben', handle: '@amira_afrobeats', specialty: 'Afro House / Percussion', tracksSubmitted: 22, reputationXp: 10400, isOnline: true }
  ]);

  setActiveTab(tab: 'demos' | 'vault' | 'events' | 'leaderboard') {
    this.activeTab.set(tab);
  }

  toggleDemoPlay(trackId: number) {
    this.demoTracks.update(tracks =>
      tracks.map(t => ({
        ...t,
        isPlaying: t.id === trackId ? !t.isPlaying : false
      }))
    );
  }

  toggleRegisterEvent(eventId: number) {
    this.events.update(list =>
      list.map(e => {
        if (e.id === eventId) {
          const nextState = !e.isRegistered;
          return {
            ...e,
            isRegistered: nextState,
            attendees: nextState ? e.attendees + 1 : e.attendees - 1
          };
        }
        return e;
      })
    );
  }
}
