import { Component, HostListener, Input, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { AreadetailComponent } from '../areadetail/areadetail.component';

@Component({
  selector: 'ohm-areadisplay',
  standalone: true,
  imports: [CommonModule, OverlayModule, AreadetailComponent],
  templateUrl: './areadisplay.component.html',
  styleUrls: ['./areadisplay.component.scss'],
})
export class AreadisplayComponent implements OnDestroy {
  @Input() reference: any;
  @Input() found: string[] = [];
  isOpen = false;

  getPresent(r: string) {
    return this.found.indexOf(r) >= 0 ? 'yes' : 'no';
  }

  @HostListener('mouseenter')
  show() {
    this.isOpen = true;
  }

  @HostListener('mouseleave')
  hide() {
    this.isOpen = false;
  }

  ngOnDestroy() {
    this.isOpen = false;
  }
}
