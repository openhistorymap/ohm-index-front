import { Component, OnInit } from '@angular/core';
import { OhmIndexService } from '../ohm-index.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  out;

  indices;


  constructor(
    private ohm: OhmIndexService
  ) { }

  ngOnInit(): void {
    this.ohm.getIndices().subscribe(indices => {
      this.indices = indices;
      this.ohm.getIndex().subscribe((data: any) => {
        this.out = data;
      });
    })
  }

  get topics() {
    return Object.keys(this.indices.topics);
  }

  getIndex(y, t) {
    return this.out.filter(x=>{
      return (x['interval'][0] === y[0]) && (x['interval'][1] === y[1]) && (x['topic'] === t);
    })[0].available;
  }

  iconFor(t) {
    return this.ohm.iconFor(t);
  }

  getReference(t){
    return Object.keys(this.indices.topics[t])
  }

  getFound(y,t){
    return this.out.filter(x=>{
      return (x['interval'][0] === y[0]) && (x['interval'][1] === y[1]) && (x['topic'] === t);
    })[0].subs
  }

}
