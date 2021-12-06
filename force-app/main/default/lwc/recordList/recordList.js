import { LightningElement, wire, track, api } from 'lwc';
import { getListUi } from 'lightning/uiListApi';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { NavigationMixin } from 'lightning/navigation';
import { deleteRecord } from 'lightning/uiRecordApi';

const actions = [
    { label: 'Edit', name: 'edit', iconName: 'utility:edit' },
    { label: 'Delete', name: 'delete', iconName: 'utility:delete' }
];

export default class RecordList extends NavigationMixin(LightningElement) {
    @api objectApiName;
    @api filterName;

    @track listViews = [];
    @track currentListViewId;
    @track records = [];
    @track objectInfo;
    @track listUi;
    @track error;

    @track isLoaded = false;
    
    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    @wire(getListUi, { objectApiName: '$objectApiName' })
    getListViews({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data && data.lists) {
            this.listViews = data.lists.map(l => ({ value: l.id, label: l.label })) || [];
            this.currentListViewId =  (data.lists.filter(l => l.apiName == this.filterName || l.id == this.filterName)[0] || data.lists[0])?.id;
        }
    }

    @wire(getListUi, { listViewId: '$currentListViewId' })
    getRecords({ data, error }) {
        if (error) {
            this.error = error;
        } else if (data && data.records) {
            this.listUi = data;
            this.error = undefined;
        }
        this.isLoaded = true;
    }

    handleSelectListView(event) {
        // update the URL with the selected filter name
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
                actionName: 'home'
            }, 
            state: {
                filterName: event.detail.value
            }
        });

        this.currentListViewId = event.detail.value;
    }

    handleNew() {
        // assumes you have created a custom page with API Name “record”
        this[NavigationMixin.Navigate]({
            type: 'comm__namedPage',
            attributes: {
                name: 'record__c'
            },
            state: {
                objectApiName: this.objectApiName,
                actionName: 'edit'
            }
        });
    }

    handleRowAction({ detail: { action: { name: action }, row: { Id: recordId } } }) {
        switch (action) {
            case 'edit':
                // assumes you have created a custom page with API Name “record”
                this[NavigationMixin.Navigate]({
                    type: 'comm__namedPage',
                    attributes: {
                        name: 'record__c'
                    },
                    state: {
                        objectApiName: this.objectApiName,
                        recordId,
                        actionName: 'edit'
                    }
                });
                break;
            case 'delete':
                deleteRecord(recordId).catch(error => {
                    this.error = error;
                });
                break;
            default:
        }
    }

    get actions() {
        return actions;
    }

    get errorString() {
		var errStr = this.error?.body?.message;
		if (errStr === undefined || errStr instanceof Object) {
			return JSON.stringify(this.error);
		}
        return errStr;
    }
}