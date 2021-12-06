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
            console.log('PROFILE DETAIL DATA: '+JSON.stringify(data));
            this.name = data.fields.Name.value;
            this.fullphotourl = data.fields.FullPhotoUrl.value;
            this.smallphotourl = data.fields.SmallPhotoUrl.value;
            this.manager = data.fields.Manager.value.fields.Name.value;
            this.title = data.fields.Title.value;
            this.companyName = data.fields.CompanyName.value;
            this.aboutMe = data.fields.AboutMe.value;
            this.email = data.fields.Email.value;
            this.country = data.fields.Country.value;
            this.phone = data.fields.Phone.value;
        }
    }
}