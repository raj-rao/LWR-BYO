import { LightningElement, api, wire, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { getRecord} from 'lightning/uiRecordApi';
import isGuestUser from '@salesforce/user/isGuest';
import USER_ID from '@salesforce/user/Id';
import basePath from '@salesforce/community/basePath'; 

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

export default class UserProfile extends NavigationMixin(LightningElement) {
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
            //console.log('USER DATA: '+JSON.stringify(data));
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
            if(data.fields.Manager.value == null){
                this.manager = '';
            }else{
                this.manager = data.fields.Manager.value.fields.Name.value;
            }
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
                this.aboutMe = data.fields.AboutMe.value;
            }
            if(data.fields.Email.value == null){
                this.email = '';
            }else{
                this.email = data.fields.Email.value;
            }
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

    @api displayUserProfileMenu(){
        let profileMenu = this.template.querySelector(".user-profile");
        profileMenu.classList.toggle("showProfile");
    }

    @api hideUserProfileMenu(){
        let profileMenu = this.template.querySelector(".user-profile");
        if(profileMenu.classList.contains('showProfile')){
            profileMenu.classList.toggle("showProfile");
        }
    }
 
    /**
     * stop propagation and ignore the click event (will not execute the close() method)as we are inside the profile menu 
    */
    handleClick(event) {
        event.stopPropagation();
        event.preventDefault();
        if(event.currentTarget.getAttribute('data-id') === 'user-profile-menu'){
            this.displayUserProfileMenu();
        }else if(event.currentTarget.getAttribute('data-id') === 'My Profile'){
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: '/profile-detail'
                }
            };
            if (this.pageReference) {
                this[NavigationMixin.Navigate](this.pageReference);
            }
        }else {
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: basePath
                }
            };
            if (this.pageReference) {
                this[NavigationMixin.Navigate](this.pageReference);
            }
        }
        //Raise Event to close the Search Box if open
        const hideSearchBoxEvent = new CustomEvent('hidesearch', { detail: 'c-search-bar', bubbles: true });
        // Dispatch the event.
        this.dispatchEvent(hideSearchBoxEvent);
        //hide user profile menu
        if(event.currentTarget.getAttribute('data-id') != 'user-profile-menu'){
            this.hideUserProfileMenu()
        }
        
        return false;
    }
}