import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { OhmIndexService } from '../../ohm-index.service';


@Component({
  selector: 'app-datasets',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ["description","authors","url","doi","format","time","kind","place"];
  dataSource = [];
  panelOpenState = false;

  indices

  @Input() source: string;

  constructor(
    public ohm: OhmIndexService,
    private ar: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ohm.getIndices().subscribe(data => {
      this.indices = data;
    })
    if(this.source){
      console.log('getting source');
      this.ohm.getDatasets({params: {for: this.source}}).subscribe((data: any) =>{
        this.dataSource = data;
      })
    } else {
      this.ar.paramMap.subscribe(pm => {
        this.ohm.getDatasets(pm).subscribe((data: any) =>{
          this.dataSource = data;
        })
      })
    } 
  }

  

  iconFor(t) {
    return this.ohm.iconFor(t);
  }
  
}
