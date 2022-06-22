import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EngineComponent } from './components/engine/engine.component';

const routes: Routes = [{
  path: 'engine',
  component: EngineComponent
}, {
  path: '**',
  redirectTo: 'engine',
  pathMatch: 'full'
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
