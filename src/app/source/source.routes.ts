import { Routes } from '@angular/router';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { DetailComponent as DDetailComponent } from '../dataset/detail/detail.component';
import { AddComponent } from './add/add.component';

export const SOURCE_ROUTES: Routes = [
  { path: '', component: ListComponent },
  {
    path: ':id',
    component: DetailComponent,
    children: [{ path: ':id', component: DDetailComponent }],
  },
  { path: 'add', component: AddComponent },
];
