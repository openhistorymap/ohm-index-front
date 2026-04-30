import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OhmIndexService } from '../../ohm-index.service';
import { TreelabelPipe } from '../../shared/treelabel.pipe';

@Component({
  selector: 'app-datasets',
  standalone: true,
  imports: [CommonModule, RouterLink, TreelabelPipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  dataSource: any[] = [];
  indices: any;
  filterPairs: { key: string; value: string }[] = [];

  @Input() source!: string;

  public ohm = inject(OhmIndexService);
  private ar = inject(ActivatedRoute);

  get embedded() { return !!this.source; }
  get hasFilter() { return this.filterPairs.length > 0; }

  ngOnInit(): void {
    this.ohm.getIndices().subscribe(data => {
      this.indices = data;
    });
    if (this.source) {
      this.ohm.getDatasets({ params: { for: this.source } }).subscribe((data: any) => {
        this.dataSource = data;
      });
    } else {
      this.ar.paramMap.subscribe(pm => {
        const pairs: { key: string; value: string }[] = [];
        pm.keys.forEach(k => {
          const v = pm.get(k);
          if (v != null) pairs.push({ key: k, value: v });
        });
        this.filterPairs = pairs;
        this.ohm.getDatasets(pm).subscribe((data: any) => {
          this.dataSource = data;
        });
      });
    }
  }

  iconFor(t: string) {
    return this.ohm.iconFor(t);
  }
}
