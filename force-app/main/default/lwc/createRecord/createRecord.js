import { LightningElement, api } from 'lwc';
import CASE_OBJECT from '@salesforce/schema/Case';
import ORIGIN_FIELD from '@salesforce/schema/Case.Origin';
import DESCRIPTION_FIELD from '@salesforce/schema/Case.Description';
import STATUS_FIELD from '@salesforce/schema/Case.Status';
import SUBJECT_FIELD from '@salesforce/schema/Case.Subject';

/**
 * Creates Case records.
 */
export default class CreateRecord extends LightningElement {
    @api objectApiName;
    caseObject = CASE_OBJECT;
    myFields = [ORIGIN_FIELD, DESCRIPTION_FIELD, STATUS_FIELD, SUBJECT_FIELD];

    handleAccountCreated(){
        // Run code when account is created.
    }
}