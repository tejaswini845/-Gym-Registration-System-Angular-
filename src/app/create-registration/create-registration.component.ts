import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../model/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
[x: string]: any;
   public packages:string[]=["Monthly","Quarterly","Yearly"];
   public gender:string[]=["Male","Female"];
   public importanatList:string[]=[
    "Toxic fat reduction",
    "Gain weight",
    "Loss weight",
    "Energy and Endurance",
    "Super Craving Body",
    "Building Lean Muscle"
   ];

   public registerForm!: FormGroup;
   public userIdToUpdate!: number;
   public isUpdateActive:boolean=false;
   
   constructor(private fb:FormBuilder,
    private activateRoute:ActivatedRoute,
    private router:Router,
     private api:ApiService,
      private toastService:NgToastService){

   }
  ngOnInit(): void {
    this.registerForm=this.fb.group({
        firstName:[''],
        lastName:[''],
        email:[''],
        mobile:[''],
        weight:[''],
        height:[''],
        bmi:[''],
        bmiResult:[''],
        opt:[''],
        gender:[''],
        package:[''],
        important:[''],
        havebeengym:[' '],
        enquirydate:[''],
       });

       this.registerForm.controls['height'].valueChanges.subscribe(res=>{
        console.log("this is res ",res);
        this.calculateBmi(res);
       });

       this.activateRoute.params.subscribe(val=>{
        this.userIdToUpdate=val['id'];
        this.api.getRegisteredUserId(this.userIdToUpdate)
        .subscribe(res=>{
            this.isUpdateActive=true;
            this.fillFormToUpdate(res);
        })
       })
  }
   submit(){
     this.api.postRegistration(this.registerForm.value)
     .subscribe(res=>{
      //  this.toastService.success({detail:"Success",summary:"Enquiry Added",duration:3000})
       alert("Product added successfully");
       this.registerForm.reset(); 
     })
   }

   update(){
    this.api.updateRegisterUser(this.registerForm.value, this.userIdToUpdate)
    .subscribe(res=>{
     //  this.toastService.success({detail:"Success",summary:"Enquiry Added",duration:3000})
      alert("Enquiry updated successfully");
      this.registerForm.reset(); 
      this.router.navigate(['list'])
    })
   }

  
   calculateBmi(heightValue:number){
      const weight=this.registerForm.value.height;
      const height= heightValue;
      const bmi= weight / (height*height) ;
      console.log("this is bmi",bmi);
      this.registerForm.controls['bmi'].patchValue(bmi);
      switch(true){
        case bmi < 18.5:
          this.registerForm.controls['bmiResult'].patchValue("Underweight");
          break;
          case (bmi >= 18.5 && bmi < 25):
            this.registerForm.controls['bmiResult'].patchValue("Normal");
            break;
            case (bmi >= 25 && bmi < 30):
              this.registerForm.controls['bmiResult'].patchValue("Overweight");
              break;
      
          default:
            this.registerForm.controls['bmiResult'].patchValue("Ooops"); 
          break;
      }
   }

   fillFormToUpdate(user:User){
      this.registerForm.setValue({
          firstName:user.firstName,
          lastName:user.lastName,
          email:user.email,
          mobile:user.mobile,
          weight:user.weight,
          height:user.height,
          bmi:user.bmi,
          bmiResult:user.bmiResult,
          opt:user.opt,
          gender:user.gender,
          package:user.package,
          important:user.important,
          havebeengym:user.havebeengym,
          enquirydate:user.enquirydate
      })
   }
}
