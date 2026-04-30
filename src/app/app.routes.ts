import { Routes } from '@angular/router';
import { IntroComponent } from './intro/intro.component';
import { MethodologyComponent } from './methodology/methodology.component';
import { IndexComponent } from './index/index.component';
import { AddComponent } from './add/add.component';

export const routes: Routes = [
  { path: '', component: IntroComponent },
  { path: 'methodology', component: MethodologyComponent },
  { path: 'index', component: IndexComponent },
  { path: 'add', component: AddComponent },
  {
    path: 'sources',
    loadChildren: () => import('./source/source.routes').then(m => m.SOURCE_ROUTES),
  },
  {
    path: 'datasets',
    loadChildren: () => import('./dataset/dataset.routes').then(m => m.DATASET_ROUTES),
  },
];
