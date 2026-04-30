import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

import { OhmIndexService } from '../../ohm-index.service';
import { TreelabelPipe } from '../../shared/treelabel.pipe';

@Component({
  selector: 'app-datasets',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatExpansionModule, TreelabelPipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['description', 'authors', 'url', 'doi', 'format', 'time', 'kind', 'place'];
  dataSource: any[] = [];
  panelOpenState = false;
  indices: any;

  @Input() source!: string;

  public ohm = inject(OhmIndexService);
  private ar = inject(ActivatedRoute);

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
