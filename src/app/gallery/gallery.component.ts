import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html'
})
export class GalleryComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  galleryName = '';
  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      this.galleryName = params.get('gallery') ?? '';
    })
  }
}
