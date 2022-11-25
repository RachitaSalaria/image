import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { image } from '../image';
import { ImageService } from '../service/image.service';

@Component({
  selector: 'app-all-image',
  templateUrl: './all-image.component.html',
  styleUrls: ['./all-image.component.css']
})
export class AllImageComponent implements OnInit {
  images: image[] = [];
  original: image[] = [];
  private imageSubscription!: Subscription
  dataDel: any;
  deldata: any;
  urls = new Array<string>();

  constructor(private imageservice: ImageService, private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.imageservice.getImages();

    this.imageSubscription = this.imageservice.getImageStream().subscribe((images: image[]) => {
    this.images = images
    console.log(this.images);
    }
    )
  }

  ngOnDestroy() {
    this.imageSubscription.unsubscribe();
  }
  deleteimage(datas: any) {
    this.toastr.error('Image deleted successfully', 'Delete');
    this.imageservice.deleteImage(datas._id).subscribe(data => {
      this.images = this.images.filter((u: any) => u!== datas)
      console.log(this.images, 'eeeeeeeeee')
    })
  }

  // deleteone(index:number){
  //   console.log('fhhhhhhhhhhhhh')
  //   this.images.splice(index,1)
  // }


  deleteoriginalimage(datas: any) {
    this.imageservice.deleteoriginal(datas._id).subscribe(data => {
      
      // 
      // this.images = this.images.filter((u:any)=>u!==datas)
      this.deldata = data;
     this.toastr.error('delete original image successfully', 'Delete');
     this.ngOnInit();

      // const filterArray = this.images.filter(val=>val.areas.includes(data))
      // console.log(filterArray)
      // const filteredarray: image[] = [];
      // datas.forEach((filterValue: any)=>{
      //   filteredarray.push(...this.images.filter(val=>val.areas.includes(filterValue)))
      // })
      // const f = this.images.filter((u:any)=>u!==datas)
      // console.log(f)
      // this.images.splice(datas._id,1)


    })
  }

  deletethumbimage(datas: any) {
    // console.log(datas);

    this.imageservice.deletethumb(datas._id).subscribe(data => {
      this.dataDel = data;
      this.toastr.error('delete thumb image successfully', 'Delete');
      
     this.ngOnInit();

      // let array = datas.filter((u:any)=>u = array)
      // const largeFiles = this.images.filter((u: any) => u.cover.original.path==null)
      // console.log(largeFiles)

    })
  }




}
