import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar';
import { HeroComponent } from './components/hero/hero';
import { AudioPlayerComponent } from './components/audio-player/audio-player';
import { FeaturesComponent } from './components/features/features';
import { InteractivePreviewComponent } from './components/interactive-preview/interactive-preview';
import { PricingComponent } from './components/pricing/pricing';
import { TestimonialsComponent } from './components/testimonials/testimonials';
import { FaqComponent } from './components/faq/faq';
import { CtaBannerComponent } from './components/cta-banner/cta-banner';
import { FooterComponent } from './components/footer/footer';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    AudioPlayerComponent,
    FeaturesComponent,
    InteractivePreviewComponent,
    PricingComponent,
    TestimonialsComponent,
    FaqComponent,
    CtaBannerComponent,
    FooterComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}
