import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord} from 'lightning/uiRecordApi';
import isGuestUser from '@salesforce/user/isGuest';
import USER_ID from '@salesforce/user/Id';

const FIELDS = [
    'User.Name',
    'User.FullPhotoUrl',
    'User.SmallPhotoUrl',
    //'User.Manager.Name',
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
            if(data.fields.FullPhotoUrl.value == null){
                    this.fullphotourl = '';
            }else{
                this.fullphotourl = data.fields.FullPhotoUrl.value;
           }
            
            if(data.fields.SmallPhotoUrl.value == null){
                this.smallphotourl = '';
            }else{
                this.smallphotourl = data.fields.SmallPhotoUrl.value;
            }
            
            /*
            if(data.fields.Manager.value.fields.Name.value == null){
                this.manager = '';
            }else{
                this.manager = data.fields.Manager.value.fields.Name.value;
            }
            */
           
            if(data.fields.Title.value == null){
                this.title = '';
            }else{
                this.title = data.fields.Title.value;
            }
            
            if(data.fields.CompanyName.value == null){
                this.companyName = '';
            }else{
                this.companyName = data.fields.CompanyName.value;
            }
            
            if(data.fields.AboutMe.value == null){
                this.aboutMe = '';
            }else{
                this.aboutMe = data.fields.AboutMe.value
            }
            this.email = data.fields.Email.value;
            
            if(data.fields.Country.value == null){
                this.country = '';
            }else{
                this.country = data.fields.Country.value;
            }
            
            if(data.fields.Phone.value == null){
                this.phone = '';
            }else{
                this.phone = data.fields.Phone.value;
            }
        }
    }
}