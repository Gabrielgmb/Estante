import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ShelfsPageRoutingModule } from './shelfs-routing.module';

import { ShelfsPage } from './shelfs.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ShelfsPageRoutingModule
  ],
  declarations: [ShelfsPage]
})
export class ShelfsPageModule {}
