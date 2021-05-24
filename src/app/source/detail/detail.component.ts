import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OhmIndexService } from 'src/app/ohm-index.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss']
})
export class DetailComponent implements OnInit {

  source;
  key;

  indices;

  constructor(
    private ar: ActivatedRoute,
    private ohm: OhmIndexService
  ) { }

  ngOnInit(): void {
    this.ar.params.subscribe(p => {
      this.key = p.id;
      this.ohm.getIndices().subscribe(data => {
        this.indices = data;
      })
      this.ohm.getSource(this.key).subscribe(d => {
        this.source = d;
      })
    });
  }

}
