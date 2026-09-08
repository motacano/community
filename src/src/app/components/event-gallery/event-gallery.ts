import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';

interface GalleryManifest {
  photos: string[];
}

@Component({
  selector: 'app-event-gallery',
  imports: [CommonModule],
  templateUrl: './event-gallery.html',
  styleUrl: './event-gallery.scss'
})
export class EventGalleryComponent implements OnInit {
  private http = inject(HttpClient);

  // Carpeta del último evento; su manifest.json se regenera automáticamente
  // (ver scripts/generate-gallery-manifest.mjs) con las fotos que realmente existan.
  readonly folder = 'assets/images/5-09-2026';
  readonly title = 'Tardeo Remember — 5 de Septiembre';

  photos = signal<string[]>([]);
  loading = signal(true);

  currentIndex = signal(0);
  currentPhoto = computed(() => this.photos()[this.currentIndex()] ?? '');

  ngOnInit() {
    this.http.get<GalleryManifest>(`${this.folder}/manifest.json`)
      .pipe(catchError(() => of<GalleryManifest>({ photos: [] })))
      .subscribe((manifest) => {
        this.photos.set(manifest.photos.map((name) => `${this.folder}/${name}`));
        this.loading.set(false);
      });
  }

  goTo(index: number) {
    const total = this.photos().length;
    if (total === 0) return;
    this.currentIndex.set(((index % total) + total) % total);
  }

  next() {
    this.goTo(this.currentIndex() + 1);
  }

  prev() {
    this.goTo(this.currentIndex() - 1);
  }
}
