import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VisitorsService {

  constructor(private firestore: AngularFirestore) { }

  createVisitor(payload: Visitor) {
    return this.firestore.collection('visitors').add(payload);
  }

  getVisitorByUid(uid: string) {
    return this.firestore.collection('visitors', ref => ref.where('uid', '==', uid)).snapshotChanges();
  }

  deleteVisitor(visitorId: string) {
    return this.firestore.doc('visitors/' + visitorId).delete();
  }

  editVisitor(visitorId: string, payload: Visitor) {
    console.log(payload);
    return this.firestore.doc('visitors/' + visitorId).update(payload);
  }

  getVisitorById(visitorId: string) {
    return this.firestore.collection('visitors', ref => ref.where('visitorId', '==', visitorId)).snapshotChanges();
  }
}

export interface Visitor {
  id?: string;
  visitorName: string;
  visitorComp: string;
  visitorHost: string;
  visitPurpose: string;
  uid: string;
  remarks: string;
}
