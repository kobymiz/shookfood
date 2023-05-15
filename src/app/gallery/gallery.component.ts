import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GalleryInfo, GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html'
})
export class GalleryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private galleryService: GalleryService) { }

  galleryName = '';
  gallery: GalleryInfo | undefined = undefined;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.galleryName = params.get('gallery') ?? '';
      this.galleryService.getGalleryByName(this.galleryName).subscribe(gallery=>{
        this.gallery = gallery;
      })
    });
  }
}
