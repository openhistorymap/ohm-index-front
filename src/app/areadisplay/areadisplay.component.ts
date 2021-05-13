import { Component, HostListener, Input, OnInit  } from '@angular/core';

@Component({
  selector: 'ohm-areadisplay',
  templateUrl: './areadisplay.component.html',
  styleUrls: ['./areadisplay.component.scss']
})
export class AreadisplayComponent implements OnInit {

  @Input() reference: any;
  @Input() found: String[];
  isOpen = false;
  constructor(
  ) { }

  ngOnInit(): void {
    
  }

  getPresent(r){
    return this.found.indexOf(r)>=0?'yes':'no';
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
