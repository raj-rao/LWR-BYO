import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord} from 'lightning/uiRecordApi';
import isGuestUser from '@salesforce/user/isGuest';
import USER_ID from '@salesforce/user/Id';

const FIELDS = [
    'User.Name',
    'User.FullPhotoUrl',
    'User.SmallPhotoUrl',
    'User.Manager.Name',
    'User.Title',
    'User.CompanyName',
    'User.AboutMe',
    'User.Email',
    'User.Country',
    'User.Phone'
];

export default class ProfileDetail extends LightningElement {
    @track error ;
    @track name;
    @track fullphotourl;
    @track smallphotourl;
    @track manager;
    @track title;
    @track companyName;
    @track aboutMe;
    @track email;
    @track country;
    @track phone;
    @track isguestuser = isGuestUser;

    @wire(getRecord, {
        recordId: USER_ID,
        fields: FIELDS
    }) wireuser({
        error,
        data
    }) {
        if (error) {
           this.error = error ;
        } else if (data) {
            this.name = data.fields.Name.value;
            //if(data.fields.FullPhotoUrl.value){
                this.fullphotourl = data.fields.FullPhotoUrl.value;
            //}else{
            //    this.fullphotourl = null;
            //}
            
            //if(data.fields.SmallPhotoUrl.value){
                this.smallphotourl = data.fields.SmallPhotoUrl.value;
            //}else{
            //    this.smallphotourl = null;
            //}
            
            //if(data.fields.Manager.value.fields.Name.value){
                this.manager = data.fields.Manager.value.fields.Name.value;
            //}else{
            //    this.manager = null;
            //}
            
            //if(data.fields.Title.value){
                this.title = data.fields.Title.value;
            //}else{
            //    this.title = null;
            //}
            
            //if(data.fields.CompanyName.value){
                this.companyName = data.fields.CompanyName.value;
            //}else{
            //    this.companyName = null;
            //}
            
            //if(data.fields.AboutMe.value){
                this.aboutMe = data.fields.AboutMe.value
            //}else{
            //    this.aboutMe = null;
            //}
            this.email = data.fields.Email.value;
            
            //if(data.fields.Country.value){
                this.country = data.fields.Country.value;
            //}else{
            //    this.country = null;
            //}
            
            //if(data.fields.Phone.value){
                this.phone = data.fields.Phone.value;
            //}else{
            //    this.phone = null;
            //}
        }
    }
}