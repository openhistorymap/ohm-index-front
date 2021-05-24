import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OhmIndexService } from 'src/app/ohm-index.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ["description","authors","url","time","kind", "place", "datasets"];
  dataSource = [];
  panelOpenState = false;

  indices;

  filter;

  constructor(
    private ohm: OhmIndexService,
    private ar: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.ar.paramMap.subscribe(pm => {
      this.filter = pm;
      this.ohm.getIndices().subscribe(data => {
        this.indices = data;
      })
      this.ohm.getSources(pm).subscribe((data: any) =>{
        this.dataSource = data;
      })
    })
  }

  iconFor(t){
    return this.ohm.iconFor(t);
  }

}
