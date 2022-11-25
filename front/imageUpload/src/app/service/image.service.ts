import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Subject } from 'rxjs';
import { image } from '../image';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private images: image[] = [];
  private images$ = new Subject<image[]>();
  readonly url = "http://localhost:8000/images";
  readonly deleteurl ="http://localhost:8000/images/";
  readonly deleteoriginalurl = "http://localhost:8000/images";
  readonly deletthumburl = "http://localhost:8000/imagest";

  constructor(private http : HttpClient) { }

  getImages() {
    return this.http
      .get<{ images: image[] }>(this.url)
      .pipe(
        map((imageData) => {
          return imageData.images;
        })
      )
      .subscribe((images) => {
        this.images = images;
        this.images$.next(this.images);
      });
  }

  getImageStream() {
    return this.images$.asObservable();
  }

  addImage(image:File):void {
    console.log(image);
    
 const imageData= new FormData();
     imageData.append("cover",image);
    this.http.post<{ image:image}>(this.url,imageData).subscribe((imageData)=>{
      console.log(imageData,'jfdjbfdjbfdjbdfj')
  //     const image : image ={
  //       _id: imageData.image._id,
      
  //       cover: imageData.image.cover
  //     }
  //  console.log(image);
   
  //   this.images.push(image);
  //   this.images$.next(this.images);
    })

  }

  deleteImage(id:any){
    return this.http.delete(this.deleteurl+id);

  }

  deleteoriginal(id:any){
    return this.http.patch(this.deleteoriginalurl,{
      id
    })
  }

  deletethumb(id:any){
    return this.http.patch(this.deletthumburl,{
      id
    })
  }


}
