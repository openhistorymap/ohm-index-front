import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class OhmIndexTimeTagService {}

@Injectable({ providedIn: 'root' })
export class OhmIndexService {
  baseUrl = environment.baseUrl;

  private http = inject(HttpClient);
  private ohmdimtt = inject(OhmIndexTimeTagService);

  icons: { [key: string]: string } = {
    agriculture: 'tractor',
    economy: 'piggy-bank',
    entertainment: 'theater-masks',
    ephemeral: 'drafting-compass',
    geography: 'globe-europe',
    industry: 'industry',
    politics: 'landmark',
    'infrastructure:roads': 'horse',
    'infrastructure:water': 'ship',
    'infrastructure:air': 'plane',
    religion: 'praying-hands',
    urban: 'city',
    climate: 'cloud',
    war: 'dove',
    physical: 'universal-access',
    location: 'map-marker-alt',
    structure: 'border-all',
    events: 'calendar-alt',
    general: 'info-circle',
    indexes: 'indent',
    model: 'kaaba',
    usage: 'sign-language',
    csv: 'file-csv',
    shapefile: 'file-medical-alt',
    geojson: 'file-medical-alt',
    geotiff: 'passport',
    jpeg2000: 'passport',
    tiff: 'file-image',
    jpeg: 'file-image',
    jpg: 'file-image',
    png: 'file-image',
    document: 'file-alt',
    map: '',
    book: '',
  };

  indices: any;

  getConf() {
    return this.http.get('assets/conf.json');
  }

  getDimensions(_name?: string) {
    return this.http.get(`${this.baseUrl}/dimensions`);
  }

  getTimeTags() {
    return this.ohmdimtt;
  }

  getIndices(): Observable<any> {
    if (this.indices) {
      return of(this.indices);
    }
    return this.http.get<any>(`${this.baseUrl}/indices`).pipe(
      map(raw => this.adaptIndices(raw)),
      tap(x => (this.indices = x)),
    );
  }

  getIndex(spaceFilter?: string[][] | null) {
    let qs = 'ohm_area__in=&tags=';
    if (spaceFilter && spaceFilter.length) {
      const flat = spaceFilter.flat().map(encodeURIComponent).join('|');
      qs = `ohm_area__in=${flat}&tags=`;
    }
    return this.http.get(`${this.baseUrl}/index?${qs}`);
  }

  getDatasets(filter?: any): Observable<any[]> {
    return forkJoin({
      sources: this.http.get<any[]>(`${this.baseUrl}/sources`),
      datasets: this.http.get<any[]>(`${this.baseUrl}/datasets`),
    }).pipe(
      map(({ sources, datasets }) => {
        const sourceById: Record<string, any> = {};
        for (const s of sources || []) sourceById[s.id] = this.adaptSource(s);
        const adapted = (datasets || []).map(d =>
          this.adaptDataset(d, sourceById[d.parent_research]),
        );
        return this.applyClientFilter(adapted, filter, 'dataset');
      }),
    );
  }

  getSources(filter?: any): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sources`).pipe(
      map(items => (items || []).map(s => this.adaptSource(s))),
      map(items => this.applyClientFilter(items, filter, 'source')),
    );
  }

  getDataset(id: string) {
    return this.http.get(`${this.baseUrl}/datasets/${id}`).pipe(
      map((d: any) => this.adaptDataset(d, null)),
    );
  }

  getSource(id: string) {
    return this.http.get(`${this.baseUrl}/sources/${id}`).pipe(
      map((s: any) => this.adaptSource(s)),
    );
  }

  iconFor(t: string) {
    if (Object.keys(this.icons).indexOf(t) >= 0) {
      return this.icons[t];
    }
    return t;
  }

  // ---------------- adapters ----------------

  private adaptIndices(raw: any): any {
    if (!raw) return {};
    if (!Array.isArray(raw)) return raw;
    const obj: any = {};
    for (const row of raw) {
      if (!row || typeof row !== 'object' || !row.name) continue;
      obj[row.name] = row.values;
    }
    if (Array.isArray(obj.areas)) {
      const dict: Record<string, string> = {};
      for (const a of obj.areas) {
        if (a?.id != null) dict[String(a.id)] = a.name ?? String(a.id);
      }
      obj.areas = dict;
    }
    if (Array.isArray(obj.years)) {
      const seen = new Set<string>();
      obj.years = obj.years.filter((y: any) => {
        const k = JSON.stringify(y);
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    }
    return obj;
  }

  private parseRaw(raw: any): any {
    if (!raw) return null;
    if (typeof raw === 'string') {
      try { return JSON.parse(raw); } catch { return null; }
    }
    return raw;
  }

  private adaptSource(s: any): any {
    if (!s) return s;
    if (s.data) return s; // already adapted
    const parsed = this.parseRaw(s.raw);
    const creators = parsed?.data?.creators ?? parsed?.creators ?? [];
    return {
      key: s.id,
      datasets: s.datasets ?? 0,
      data: {
        key: s.id,
        title: s.title,
        itemType: s.type,
        url: s.url,
        tags: s.tags || {},
        creators,
      },
      meta: { creatorSummary: s.creator_summary || '' },
    };
  }

  private adaptDataset(d: any, parent: any): any {
    if (!d) return d;
    if (d.data) return d;
    return {
      key: d.id,
      data: {
        key: d.id,
        title: d.title,
        url: d.url,
        tags: d.tags || {},
        parentItem:
          parent ?? {
            key: d.parent_research,
            data: { title: d.parent_research || 'Source', url: '', tags: {} },
            meta: { creatorSummary: '' },
          },
      },
    };
  }

  private applyClientFilter(items: any[], filter: any, kind: 'source' | 'dataset'): any[] {
    if (!filter) return items;
    const params = filter.params ?? filter;
    const read = (k: string): string | null => {
      if (params == null) return null;
      if (typeof params.get === 'function') return params.get(k);
      const v = params[k];
      return v == null ? null : String(v);
    };
    let out = items;
    const topic = read('ohm:topic');
    if (topic) {
      out = out.filter(x => {
        const tags = kind === 'dataset' ? x.data?.parentItem?.data?.tags : x.data?.tags;
        return tags?.['ohm:topic'] === topic;
      });
    }
    const fromTime = read('ohm:from_time');
    if (fromTime) {
      out = out.filter(x => {
        const tags = kind === 'dataset' ? x.data?.parentItem?.data?.tags : x.data?.tags;
        return String(tags?.['ohm:from_time']) === fromTime;
      });
    }
    const toTime = read('ohm:to_time');
    if (toTime) {
      out = out.filter(x => {
        const tags = kind === 'dataset' ? x.data?.parentItem?.data?.tags : x.data?.tags;
        return String(tags?.['ohm:to_time']) === toTime;
      });
    }
    const forSource = read('for');
    if (forSource && kind === 'dataset') {
      out = out.filter(x => x.data?.parentItem?.key === forSource);
    }
    return out;
  }
}
