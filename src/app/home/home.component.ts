import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public studentCollection: Students[];

  public ID: string;
  public Firstname: string;
  public Lastname: string;
  public ClassRoom: string;

  public isEditMode = false;
  public isLoading = false ;

  constructor(private firestore: AngularFirestore) {

  }

  async initData() {
    let students: Students[];

    this.isLoading = true;
    await this.promiseData().then(value => {
            students = value as Students[];
    });

    // this.ObservData().subscribe({
    //   next(data) {
    //       students = data as Students[];
    //       console.log(data);
    //   }
    // });

    this.studentCollection = students;
    this.ID = this.studentCollection[this.studentCollection.length - 1].id + 1;
    this.isLoading = false;
  }

  promiseData(){
    return new Promise((resolve, reject) => {
        this.firestore.collection('students', r => r.orderBy('id', 'asc')).valueChanges().subscribe(value => {
          resolve(value);
        });
    });
  }

  ObservData(){
    return new Observable((obserable) => {
        this.firestore.collection('students', r => r.orderBy('id', 'asc')).valueChanges().subscribe(value => {
          obserable.next(value);
        });
    });
  }

  ngOnInit() {
    this.initData();
  }

  async addStudent() {
    this.isLoading = true;
    const data = {
      id: this.ID,
      firstname: this.Firstname,
      lastname: this.Lastname,
      classRoom: this.ClassRoom
    };
    await this.firestore.collection('students').doc(String(this.ID)).set(data);

    await this.initData();
    this.clearFields();
    this.isLoading = false;
  }

  async updateStudnet() {
    this.isLoading = true;
    const data = {
      id: this.ID,
      firstname: this.Firstname,
      lastname: this.Lastname,
      classRoom: this.ClassRoom
    };
    await this.firestore.collection('students').doc(String(this.ID)).set(data);

    this.initData();
    this.clearFields();

    this.isEditMode = false;
    this.isLoading = false;
  }

  receiveStudent(id: string) {
      const student = this.studentCollection.find(element => {
          return element.id === id;
      });

      this.isEditMode = true;
      // console.log(student);

      this.ID = student.id;
      this.Firstname = student.firstname;
      this.Lastname = student.lastname;
      this.ClassRoom = student.classRoom;
  }


  clearFields() {
    this.Firstname = '';
    this.Lastname = '';
    this.ClassRoom = '';
  }
}

class Students {
  public id: string;
  public firstname: string;
  public lastname: string;
  public classRoom: string;
}
