import { Component, Input, OnInit } from '@angular/core';
import { OhmIndexService } from '../ohm-index.service';

@Component({
  selector: 'ohm-areadetail',
  templateUrl: './areadetail.component.html',
  styleUrls: ['./areadetail.component.scss']
})
export class AreadetailComponent implements OnInit {

  @Input() reference: any;
  @Input() found: String[];

  constructor(
    private ohm:OhmIndexService
  ) { }

  ngOnInit(): void {
  }

  getPresent(r){
    return this.found.indexOf(r)>=0?'yes':'no';
  }

  iconFor(t) {
    return this.ohm.iconFor(t);
  }
}
