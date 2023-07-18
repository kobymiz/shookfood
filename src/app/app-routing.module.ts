import { HomePageComponent } from './home-page/home-page.component';
import {GalleryComponent} from './gallery/gallery.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'gallery/:gallery', component: GalleryComponent},
  {
    path: 'booking',
    loadChildren: () => import('./booking/booking.module').then(m => m.BookingModule),
    data: {
      title: 'Booking'
    }
  },
  {
    path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule),
    data: {
      title: 'Recipes'
    }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
