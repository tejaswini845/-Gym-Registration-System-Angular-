import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DataSource } from '@angular/cdk/collections';
import { User } from '../model/user.model';
import { ApiService } from '../service/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgConfirmService} from 'ng-confirm-box';

@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit{
  public dataSource!:MatTableDataSource<User>;
  public users!:User[];
  @ViewChild(MatPaginator) paginator!:MatPaginator;
  @ViewChild(MatSort) sort!:MatSort

  displayedColumns:string[] =['id','firstName','lastName','email','mobile','bmiResult','gender','package','enquirydate','action'];

  constructor(private api: ApiService, private router:Router, private confirm:NgConfirmService) {
    
  }
  ngOnInit(): void {
    this.getUsers();

  }

  getUsers(){
    this.api.getRegisteredUser()
    .subscribe(res=>{
      this.users=res;
      this.dataSource=new MatTableDataSource(this.users);
      this.dataSource.paginator=this.paginator;
      this.dataSource.sort=this.sort;
    })
  }
  
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}


  edit(id:number){
    this.router.navigate(['update',id])
  }

  delete(id:number){
    this.confirm.showConfirm("Are your sure to delete this enquiry?",()=>{
        
      this.api.deleteRegistered(id)
      .subscribe(res=>{
           alert("Enquiry deleted successfully");
           this.getUsers();
       })
    },
    ()=>{
      
    })
  
   }


}
