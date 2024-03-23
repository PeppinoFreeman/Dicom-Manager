import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteLinks } from './enums/route-links';

export const routes: Routes = [
  {
    path: RouteLinks.Main,
    redirectTo: RouteLinks.Create,
    pathMatch: 'full',
  },
  {
    path: RouteLinks.Create,
    loadChildren: () =>
      import('./modules/create/create.module').then((m) => m.CreateModule),
  },
  {
    path: RouteLinks.List,
    loadChildren: () =>
      import('./modules/list/list.module').then((m) => m.ListModule),
  },
  {
    path: `${RouteLinks.View}/:id`,
    loadChildren: () =>
      import('./modules/view/view.module').then((m) => m.ViewModule),
  },
  {
    path: '**',
    redirectTo: RouteLinks.Create,
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // anchorScrolling: 'enabled',
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'enabled',
      enableTracing: false,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
