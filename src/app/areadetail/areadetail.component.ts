import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OhmIndexService } from '../ohm-index.service';

@Component({
  selector: 'ohm-areadetail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './areadetail.component.html',
  styleUrls: ['./areadetail.component.scss'],
})
export class AreadetailComponent {
  @Input() reference: any;
  @Input() found: string[] = [];

  private ohm = inject(OhmIndexService);

  getPresent(r: string) {
    return this.found.indexOf(r) >= 0 ? 'yes' : 'no';
  }

  iconFor(t: string) {
    return this.ohm.iconFor(t);
  }
}
