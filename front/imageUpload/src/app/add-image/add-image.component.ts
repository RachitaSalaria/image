import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { image } from '../image';
import { ImageService } from '../service/image.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-image',
  templateUrl: './add-image.component.html',
  styleUrls: ['./add-image.component.css']
})
export class AddImageComponent implements OnInit {
  form!: FormGroup;
  image!: image;
  imageData!: any;
  constructor(private imageservice: ImageService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      image: new FormControl(null, [Validators.required,]),
    });
  }

  onFileSelect(event: any) {

    const target = event.target as HTMLInputElement;
    const file: File = (target.files as FileList)[0];
    this.form.patchValue({ image: file });
    const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (file && allowedMimeTypes.includes(file.type)) {
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }


  onSubmit() {
    console.log("1111111111");


    if (!this.form.valid) {
      alert('please choose the image')

    } else {
      console.log('hhhhhhhhhhhhhhhhhhhhhh')
      this.imageservice.addImage(this.form.value.image);
      this.form.reset();
      this.imageData = null;
      window.location.reload();
      this.toastr.success('Image created successfully', 'succes');
      // alert("image created successfully")

      // alert("image created successfully")
    }
  }


}
