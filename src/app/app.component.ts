import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';
import { VisitorsService, Visitor } from './visitors.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'petroco';

  addVisitor:boolean = false;
  loggedIn: boolean = false;

  userDetails = {
    name: '',
    uid: '',
    email: ''
  };

  date: Date;

  visitorForm = new FormGroup({
    visitorName: new FormControl(''),
    visitorComp: new FormControl(''),
    visitorHost: new FormControl(''),
    visitPurpose: new FormControl('')
  });

  list: Visitor[] = [];

  constructor(public auth: AngularFireAuth, private visitorsService: VisitorsService){
    this.auth.onAuthStateChanged(user => {
      if (user){
        this.loggedIn = true;
        console.log(user);
        this.userDetails.name = user.displayName;
        this.userDetails.uid = user.uid;
        this.userDetails.email = user.email;

        console.log(this.userDetails);
        this.getVisitors(this.userDetails.uid);
      }
    });

    setInterval(() => {
      this.date = new Date();
    }, 1000);
  }

  // tslint:disable-next-line:typedef
  login() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  // tslint:disable-next-line:typedef
  logout() {
    this.auth.signOut();
    this.loggedIn = false;
  }

  reset() {
    this.visitorForm.reset();
  }

  addNewVisitor() {
    this.addVisitor = true;

  }

  closeAddVisitor() {
    this.reset();
    this.addVisitor = false;
  }

  getVisitors(uid): void {
    this.visitorsService.getVisitorByUid(uid).subscribe((res) => {
      this.list = res.map((visitor) => {
        return {
          id: visitor.payload.doc.id,
          ...visitor.payload.doc.data() as Visitor
        };
      });
    });
  }

  saveNewVisitor(details) {
    details.remarks = '';
    details.uid = this.userDetails.uid;
    console.log(details);
    this.visitorsService.createVisitor(details);
    this.reset();
  }

  editRemarks(details, newRemarks) {
    details.remarks = newRemarks;
    console.log(details);
    this.visitorsService.editVisitor(details.id, details);
    console.log(newRemarks);
  }

  deleteVisitor(id) {
    console.log(id);
    this.visitorsService.deleteVisitor(id).then();
  }
}
