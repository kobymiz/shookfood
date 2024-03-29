import { HomePageComponent } from './home-page/home-page.component';
import {GalleryComponent} from './gallery/gallery.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthFormComponent } from './auth-form/auth-form.component';
import { authGuard } from './auth-guard';

const routes: Routes = [
  {path: '', component: HomePageComponent},
  {path: 'login', component: AuthFormComponent},

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
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard],
    
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
