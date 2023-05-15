import { Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

export interface GalleryInfo{
  name: string,
  title: string,
  previewImage: string
}

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  private galleryUrl = 'assets/img/gallery/galleries-list.json';
  private galleries: GalleryInfo[] = [];
  private galleriesLoaded = false;

  constructor(private http: HttpClient) {
  }

  getGalleriesList(): Observable<any[]> {
    if (this.galleriesLoaded) {
      return of(this.galleries);
    } else {
      return this.loadGalleries();
    }
  }

  getGalleryByName(galleryName: string): Observable<GalleryInfo | undefined>{
    if (this.galleriesLoaded) {
      return of(this.galleries.find(g=>g.name==galleryName));
    } else {
      return this.loadGalleries().pipe(map(data=>data.find(g=>g.name==galleryName)));
    }
  }

  private loadGalleries(): Observable<GalleryInfo[]> {
    return this.http.get<GalleryInfo[]>(this.galleryUrl).pipe(
      map(data => {
        this.galleries = data;
        this.galleriesLoaded = true;
        return data;
      }),
      catchError(error => {
        console.error('Failed to load galleries', error);
        return of([]);
      })
    );
  }
}
