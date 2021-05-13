import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, sample } from 'rxjs/operators';
import { environment } from '../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class OhmIndexTimeTagService { 
  constructor(
    private http:HttpClient,
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class OhmIndexService {
  baseUrl = environment.baseUrl;

  constructor(
    private http: HttpClient,
    private ohmdimtt: OhmIndexTimeTagService
  ) { }

  
  icons = {
    agriculture: 'tractor',
    economy:'piggy-bank',
    entertainment:'theater-masks',
    ephemeral:'drafting-compass',
    geography:'globe-europe',
    industry: 'industry',
    politics: 'landmark',
    'infrastructure:roads':'horse',
    'infrastructure:water':'ship',
    'infrastructure:air':'plane',
    'religion':'praying-hands',
    urban: 'city',
    climate: 'cloud',
    war:'dove',

    physical: 'universal-access',

    location: 'map-marker-alt',
    structure: 'border-all',
    events: 'calendar-alt',
    general: 'info-circle',
    indexes: 'indent',
    model: 'kaaba',
    usage: 'sign-language',

    csv:'file-csv',
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

  }

  getConf(){
    return this.http.get('assets/conf.json');
  }

  getDimensions(name){
    return this.http.get(`${this.baseUrl}/dimensions`)
  }

  getTimeTags(){
    return this.ohmdimtt;
  }

  getIndices(){
    return this.http.get(`${this.baseUrl}/indices`);
  }

  getIndex() {
    return this.http.get(`${this.baseUrl}/index`);
  }

  getDatasets(filter?: any){
    return this.http.get(`${this.baseUrl}/datasets`, filter);
  }

  getSources(filter?: any){
    return this.http.get(`${this.baseUrl}/sources`, filter);
  }

  addDataset(dataset: any){
    
  }


  iconFor(t){
    if (Object.keys(this.icons).indexOf(t) >= 0) {
      return this.icons[t];
    } else {
      return t;
    }
  }
}
