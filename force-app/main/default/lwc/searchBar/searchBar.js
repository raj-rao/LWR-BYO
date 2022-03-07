import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'; //added by Raj Rao on 7/28/2021
import boxIconStyles from '@salesforce/resourceUrl/boxIconsCSS';


export default class SearchBar extends NavigationMixin(LightningElement) {
    @api searchPlaceholder = "Search...";

    /**
     * if the boxIconsCSS resource has been loaded
     */
     @track isCSSLoaded = false;

    handleKeyUp(evt) {
        const isEnterKey = evt.keyCode === 13;
        const queryTerm = evt.target.value;
        if (isEnterKey && queryTerm) {
            this.navigateToSearch(queryTerm);
        }
    }

    navigateToSearch(queryTerm) {
        // Navigate to search page using lightning/navigation API: https://developer.salesforce.com/docs/component-library/bundle/lightning:navigation/documentation
        this[NavigationMixin.Navigate]({
            type: 'standard__search',
            attributes: {},
            state: {
                term: queryTerm
            }
        });
    }

    displaySearchBox() {
        let searchBox = this.template.querySelector(".search-box");
        let searchBar = this.template.querySelector(".search-box .bx-search");
        //display search box
        searchBox.classList.toggle("showSearchBox");//showInput
        if(searchBox.classList.contains("showSearchBox")){//showInput
            searchBar.classList.replace("bx-search" ,"bx-x");
        }else {
            searchBar = this.template.querySelector(".search-box .bx-x");
            this.template.querySelector(".input-box input").value = "";
            searchBar.classList.replace("bx-x" ,"bx-search");
        }
    }

    @api hideSearchBox(){
        let searchBox = this.template.querySelector(".search-box");
        if(searchBox.classList.contains("showSearchBox")){//showInput
            let searchBar = this.template.querySelector(".search-box .bx-x");
            searchBox.classList.toggle("showSearchBox");//showInput
            this.template.querySelector(".input-box input").value = "";
            searchBar.classList.replace("bx-x" ,"bx-search");
        }
    }

    /**
     * stop propagation and ignore the click event (will not execute the close() method)as we are inside the profile menu 
    */
    handleClick(event) {
        event.stopPropagation();
        if(event.currentTarget.getAttribute('data-id') === 'search-box'){
            this.displaySearchBox();
        }
        //Raise Event to close the User Profile Menu if open
        const hideUserProfileEvent = new CustomEvent('hideuserprofile', { detail: 'c-user-profile', bubbles: true });
        // Dispatch the event.
        this.dispatchEvent(hideUserProfileEvent);
        
        return false;
    }

    /**
     * close the Search Box if a click is detected outside of the boundries of this component 
    */
    /*
    close() { 
        console.log('we should close now from SearchBar.js');
        let searchBox = this.template.querySelector(".search-box");
        if(searchBox.classList.contains("showInput")){
            this.hideSearchBox();
        }
    }
    */
   
    renderedCallback() {
        Promise.all([
          loadStyle(this, boxIconStyles),
          //loadStyle(this, googleFontsCSS + '/googleFontsCSS.css')
        ]).then(() => {
            this.isCSSLoaded = true;
        })
    }

    insideClick(event) {
        // This event is necessary to not trigger close with a click inside the search box.
        event.stopPropagation();
        return false;
    }
}