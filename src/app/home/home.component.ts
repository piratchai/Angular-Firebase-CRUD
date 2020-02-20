import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public studentCollection: any[];

  public list: any[];

  public ID: string;
  public Name: string;

  public Firstname: string;
  public Lastname: string;
  public ClassRoom: string;

  constructor(private firestore: AngularFirestore) {
      this.initData();

      // this.list = [
      //     {
      //       id: 1,
      //       name: 'One'
      //     },
      //     {
      //       id: 2,
      //       name: 'Two'
      //     }
      // ];

      // console.log(this.list);
  }

  async initData(){
    let students: any;

    await this.promiseData().then(value => {
            students = value;
    });

    this.studentCollection = students;
    this.ID = this.studentCollection[this.studentCollection.length - 1].id + 1;
  }

  promiseData(){
    return new Promise((resolve, reject) => {
        this.firestore.collection('students', r => r.orderBy('id', 'asc')).valueChanges().subscribe(value => {
          resolve(value);
        });
    });
  }

  ngOnInit() {

  }

  // addList() {
  //   const data = {
  //       id: this.ID,
  //       name: this.Name
  //   };
  //   this.list.push(data);

  //   console.log(this.list);
  // }

  async addStudent() {
    const data = {
      id: this.ID,
      firstname: this.Firstname,
      lastname: this.Lastname,
      classRoom: this.ClassRoom
    };
    await this.firestore.collection('students').doc(String(this.ID)).set(data);

    await this.initData();

    this.Firstname = '';
    this.Lastname = '';
    this.ClassRoom = '';
  }
}
