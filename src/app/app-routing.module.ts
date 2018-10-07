import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';

import { ResetComponent } from './reset';
import { SuccessComponent } from './success';

const routes: Routes = [
  { path: '', redirectTo: '/reset', pathMatch: 'full' },
  { path: 'reset', component: ResetComponent },
  { path: 'success', component: SuccessComponent },
  
  // otherwise redirect to home
   { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [ RouterModule ],
  declarations: []
})
export class AppRoutingModule { }
