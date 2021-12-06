
import { LightningElement, api, wire, track } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class ObjectHeader extends LightningElement {
    @api objectApiName;
    @api plural

    @track objectInfo;

    @wire(getObjectInfo, { objectApiName: '$objectApiName' })
    getObjectInfo({ data, error }) {
        if (error) {
            this.error = error.body || error;
        } else if (data) {
            this.objectInfo = data;
        }
    }

    get label() {
        return this.objectInfo && (this.plural ? this.objectInfo.labelPlural : this.objectInfo.label);
    }

    get iconStyle() {
        return `background-color: #${this.objectInfo.themeInfo.color}`;
    }
}