import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { HeroComponent } from '../../components/hero/hero';
import { AudioPlayerComponent } from '../../components/audio-player/audio-player';
import { FeaturesComponent } from '../../components/features/features';
import { InteractivePreviewComponent } from '../../components/interactive-preview/interactive-preview';
import { FaqComponent } from '../../components/faq/faq';
import { FooterComponent } from '../../components/footer/footer';
import { CommunitySocialComponent } from '../../components/community-social/community-social';
import { CommunityEventComponent } from '../../components/community-event/community-event';
import { EventGalleryComponent } from '../../components/event-gallery/event-gallery';
import { EscuelaComponent } from '../../components/escuela/escuela';
import { ContactoComponent } from '../../components/contacto/contacto';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    CommunitySocialComponent,
    CommunityEventComponent,
    EventGalleryComponent,
    EscuelaComponent,
    AudioPlayerComponent,
    FeaturesComponent,
    InteractivePreviewComponent,
 
    FaqComponent,
    ContactoComponent,
    FooterComponent
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class HomeComponent {}
