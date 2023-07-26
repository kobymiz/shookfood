import { HomePageComponent } from './home-page/home-page.component';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { EventsComponent } from './events/events.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule} from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeHe from '@angular/common/locales/he';
registerLocaleData(localeHe);

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BookingModule } from './booking/booking.module';
import { Angular2ImageGalleryModule } from 'angular2-image-gallery';
import { GalleriesListComponent } from './gallery/galleries-list.component';
import { GalleryComponent } from './gallery/gallery.component';
import { ClientsFeedbackComponent } from './clients-feedback/clients-feedback.component';
import { RecipesModule } from './recipes/recipes.module';
import { AuthFormComponent } from './auth-form/auth-form.component';


@NgModule({
  declarations: [
    AppComponent,
    AuthFormComponent,
    HomePageComponent,
    AboutUsComponent,
    EventsComponent,
    PortfolioComponent,
    ContactFormComponent,
    ClientsFeedbackComponent,
    GalleriesListComponent,
    GalleryComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    BookingModule,
    RecipesModule,
    FormsModule,
    ReactiveFormsModule,
    Angular2ImageGalleryModule,
    HammerModule
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'he-IL' }],
  bootstrap: [AppComponent]
})
export class AppModule { }
