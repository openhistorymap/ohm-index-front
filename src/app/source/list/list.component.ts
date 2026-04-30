import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';

import { OhmIndexService } from '../../ohm-index.service';
import { TreelabelPipe } from '../../shared/treelabel.pipe';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatTableModule, MatExpansionModule, TreelabelPipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  displayedColumns: string[] = ['description', 'authors', 'url', 'time', 'kind', 'place', 'datasets'];
  dataSource: any[] = [];
  panelOpenState = false;
  indices: any;
  filter: any;

  private ohm = inject(OhmIndexService);
  private ar = inject(ActivatedRoute);

  ngOnInit(): void {
    this.ar.paramMap.subscribe(pm => {
      this.filter = pm;
      this.ohm.getIndices().subscribe(data => {
        this.indices = data;
      });
      this.ohm.getSources(pm).subscribe((data: any) => {
        this.dataSource = data;
      });
    });
  }

  iconFor(t: string) {
    return this.ohm.iconFor(t);
  }
}
