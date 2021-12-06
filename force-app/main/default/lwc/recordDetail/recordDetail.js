import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class RecordDetail extends NavigationMixin(LightningElement) {
    @api objectApiName;
    @api recordId;
    @api actionName = 'view';

    navigateToRecordList() {
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: this.objectApiName,
                actionName: 'home'
            }
        });
    }
}