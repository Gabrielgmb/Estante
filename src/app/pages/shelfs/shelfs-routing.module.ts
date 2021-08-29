import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ShelfsPage } from './shelfs.page';

const routes: Routes = [
  {
    path: '',
    component: ShelfsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ShelfsPageRoutingModule {}
