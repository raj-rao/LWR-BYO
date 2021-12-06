import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import basePath from '@salesforce/community/basePath';

export default class NavigationMenuItem extends NavigationMixin(LightningElement) {

    /**
     * the NavigationMenuItem from the Apex controller, 
     * contains a label and a target.
     */
    @api item = {};

    @track href = 'javascript:void(0);';

    /**
     * menuItem object for event detail
     */
    menuItem;

    /**
     * the PageReference object used by lightning/navigation
     */
    pageReference;

    connectedCallback() {
        const { type, target, defaultListViewId } = this.item;
        
        // get the correct PageReference object for the menu item type
        if (type === 'SalesforceObject') {
            // aka "Salesforce Object" menu item
            this.pageReference = {
                type: 'standard__objectPage',
                attributes: { 
                    objectApiName: target
                },
                state: {
                    filterName: defaultListViewId
                }
            };
        } else if (type === 'InternalLink') {
            // aka "Site Page" menu item

            // WARNING: Normally you shouldn't use 'standard__webPage' for internal relative targets, but
            // we don't have a way of identifying the Page Reference type of an InternalLink URL
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: basePath + target
                }
            };
        } else if (type === 'ExternalLink') {
            // aka "External URL" menu item
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        }

        // use the NavigationMixin from lightning/navigation to generate the URL for navigation. 
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
    }

    handleClick(event) {
        // use the NavigationMixin from lightning/navigation to perform the navigation.
        event.stopPropagation();
        event.preventDefault();
        let menuIndx=event.currentTarget.getAttribute("data-id");

        this.menuItem = {
            menuIndx:event.currentTarget.getAttribute("data-id"), 
            parentId:event.currentTarget.getAttribute("parent-id"),
            hasChildren:event.currentTarget.getAttribute("has-children"),
            indx:event.currentTarget.getAttribute("data-indx")
        };

        //Hide the submenu by creating and dispatching an event
        //Creates the event with the menuIndx or indx data which identifies which menu item was clicked
         const selectedSubMenuEvent = new CustomEvent('selectedsubmenu', { detail: this.menuItem, bubbles: true });

        // Dispatches the event.
        this.dispatchEvent(selectedSubMenuEvent);

        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        } else {
            console.log(`Navigation menu type "${this.item.type}" not implemented for item ${JSON.stringify(this.item)}`);
        }
    }
}