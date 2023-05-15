import { Component, OnInit } from '@angular/core';
import { GalleryService, GalleryInfo } from './gallery.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-galleries-list',
  templateUrl: './galleries-list.component.html'
})
export class GalleriesListComponent implements OnInit {

  constructor(private galleryService: GalleryService) { }

  galleryName = '';
  galleries$: Observable<GalleryInfo[]> = of([]);

  ngOnInit(): void {
    this.galleries$ = this.galleryService.getGalleriesList();
  }
}
