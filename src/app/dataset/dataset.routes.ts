import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';

export const DATASET_ROUTES: Routes = [
  { path: '', component: ListComponent },
  { path: ':id', component: DetailComponent },
  { path: 'add', component: AddComponent },
];
