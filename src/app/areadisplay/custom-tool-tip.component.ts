import { CommonModule } from '@angular/common';
import { Component, Input, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-custom-tool-tip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div>
      <div class="tooltip-conatiner">
        <ng-template #simpleText>{{ text }}</ng-template>
        <ng-container *ngTemplateOutlet="contentTemplate || simpleText"></ng-container>
      </div>
    </div>
  `,
  styles: [],
})
export class CustomToolTipComponent {
  @Input() text!: string;
  @Input() contentTemplate!: TemplateRef<any>;
}
