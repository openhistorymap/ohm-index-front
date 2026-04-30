import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, KeyValuePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OhmIndexService } from '../../ohm-index.service';
import { TreelabelPipe } from '../../shared/treelabel.pipe';
import { ListComponent as DatasetListComponent } from '../../dataset/list/list.component';

@Component({
  selector: 'app-source-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, KeyValuePipe, TreelabelPipe, DatasetListComponent],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  source: any;
  key: any;
  indices: any;

  private ar = inject(ActivatedRoute);
  private ohm = inject(OhmIndexService);

  ngOnInit(): void {
    this.ar.params.subscribe(p => {
      this.key = p['id'];
      this.ohm.getIndices().subscribe(data => {
        this.indices = data;
      });
      this.ohm.getSource(this.key).subscribe(d => {
        this.source = d;
      });
    });
  }

  keepOriginalOrder = (_a: any, _b: any) => 0;
}
