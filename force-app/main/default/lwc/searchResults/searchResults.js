import { LightningElement, api, track, wire } from 'lwc';
import searchInObject from '@salesforce/apex/GlobalSearchController.searchInObject';

export default class SearchBar extends LightningElement {
    @api searchString;
    @api objectApiName;

    @track results;
    @track isLoaded = false;
    @track hasError = false;

    error;

    @wire(searchInObject, { searchString: '$searchString', objectApiName: '$objectApiName' })
    wiredSearchResults({ error, data }) {
        if (data) {
            this.results = data;
            this.isLoaded = true;
        } else if (error) {
            this.hasError = true;
            this.error = error;
            this.isLoaded = true;
        }
    }

    get numResultsMessage() {
        return this.results && `${this.results.length} result${(this.results.length === 1) ? '' : 's'} found`;
    }

    get errorMessage() {
        // should actually parse the 'error' object for message
        return "An Error has occured.";
    }
}