import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pricing',
  imports: [CommonModule],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss'
})
export class PricingComponent {
  isAnnual = signal(true);

  toggleBilling(annual: boolean) {
    this.isAnnual.set(annual);
  }
}
