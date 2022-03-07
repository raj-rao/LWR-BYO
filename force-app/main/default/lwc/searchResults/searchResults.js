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
            this.error = error.body.message;
            //parse error message
            // UI API read operations return an array of objects
            if(Array.isArray(error.body)) {
                this.error = error.body.map(e => e.message).join(', ');
            } 
            // UI API write operations, Apex read and write operations 
            // and network errors return a single object
            else if(typeof error.body.message === 'string') {
                this.error = error.body.message;
            }
            this.isLoaded = true;
        }
    }

    get numResultsMessage() {
        return this.results && `${this.results.length} result${(this.results.length === 1) ? '' : 's'} found`;
    }

    get errorMessage() {
        return this.error;
    }
}