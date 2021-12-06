import { api } from 'lwc';
import LightningDatatable from 'lightning/datatable';
import nameTemplate from './name.html';
import { convertType } from './utils';

/**
 * A LightningDatatable able to display UI API list view records
 */
export default class RecordTable extends LightningDatatable {
    nameFieldValue;

    static customTypes = {
        'name': {
            template: nameTemplate
        }
    };

    constructor() {
        super();
        this.keyField = 'id';
    }

    @api
    set objectInfo(objectInfo) {
        this.state.objectInfo = objectInfo;

        // get field types from object info
        this.state.dataTypes = Object.values(objectInfo.fields).reduce((dataTypes, { apiName, dataType }) => {
            dataTypes[apiName] = convertType(dataType);
            return dataTypes;
        }, {});

        // get the API name of the name field if any - Ignore FirstName and LastName fields
        /*this.state.nameField = Object.values(objectInfo.fields)
            .filter(({ nameField }) => nameField)
            .map(({ apiName }) => apiName )
            .find(() => true);
        */    
            let nameFieldMap = Object.values(objectInfo.fields)
                                .filter(({ nameField }) => nameField)
                                .map(({ apiName }) => apiName );
            for(let value of nameFieldMap.values()) {
                if(value !== 'FirstName' || value!== 'LastName'){
                    this.nameFieldValue = value;
                }
            }
            this.state.nameField = this.nameFieldValue;
    }

    get objectInfo() {
        return this.state.objectInfo;
    }

    @api 
    set listUi(listUi) {
        this.state.listUi = listUi;
        this.convertData();
        this.convertColumns();
    }

    get listUi() {
        return this.state.listUi;
    }

    @api 
    set actions(actions) {
        this.state.actions = actions;
        this.convertColumns();
    }

    get actions() {
        return this.state.actions;
    }

    convertData() {
        this.data = this.state.listUi && this.state.listUi.records.records.map(record => {
            return Object.entries(record.fields).reduce((recordData, [apiName, { value }]) => {
                recordData[apiName] = apiName === this.state.nameField ? {
                    objectApiName: record.apiName,
                    id: record.id,
                    name: value
                } : value;
                return recordData;
            }, {});
        });
    }

    convertColumns() {
        this.columns = this.state.listUi && [...this.state.listUi.info.displayColumns.map(({ fieldApiName, label }) => ({
            label,
            fieldName: fieldApiName,
            //type: fieldApiName === this.state.nameField ? 'name' : this.state.dataTypes[fieldApiName]
            type: fieldApiName === this.state.nameField ? 'name' : (this.state.dataTypes[fieldApiName] === 'date'? {typeAttributes: {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                //second: '2-digit',
                //hour12: true
              }} : this.state.dataTypes[fieldApiName])
        })), ...((this.state.actions && [{
            type: 'action',
            typeAttributes: { rowActions: this.state.actions }
        }]) || [])];
    }
}