import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { OhmIndexService } from '../../ohm-index.service';
import { TreelabelPipe } from '../../shared/treelabel.pipe';

@Component({
  selector: 'app-source-list',
  standalone: true,
  imports: [CommonModule, RouterLink, TreelabelPipe],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  readonly entries = signal<any[]>([]);
  readonly indices = signal<any>(null);
  readonly filterPairs = signal<{ key: string; value: string }[]>([]);
  readonly hasFilter = computed(() => this.filterPairs().length > 0);

  private ohm = inject(OhmIndexService);
  private ar = inject(ActivatedRoute);

  ngOnInit(): void {
    this.ar.paramMap.subscribe(pm => {
      const pairs: { key: string; value: string }[] = [];
      pm.keys.forEach(k => {
        const v = pm.get(k);
        if (v != null) pairs.push({ key: k, value: v });
      });
      this.filterPairs.set(pairs);
      this.ohm.getIndices().subscribe(data => this.indices.set(data));
      this.ohm.getSources(pm).subscribe((data: any) => this.entries.set(data));
    });
  }

  iconFor(t: string) {
    return this.ohm.iconFor(t);
  }
}
