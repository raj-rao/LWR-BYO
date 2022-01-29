import { LightningElement, api } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

export default class LightningNavigationButton extends NavigationMixin(
    LightningElement
) {
    @api label;
    @api navigationType;
    @api url;
    @api stretch;
    @api variant;

    get buttonClass() {
        let cssClasses = 'slds-button';
        if (this.variant === 'brand') {
            cssClasses = cssClasses + ' slds-button_brand';
        } else if (this.variant === 'neutral') {
            cssClasses = cssClasses + ' slds-button_neutral';
        }

        if (this.stretch) {
            cssClasses = cssClasses + ' slds-button_stretch';
        }
        return cssClasses;
    }

    handleClick() {
        if (this.navigationType === 'comm__namedPage') {
            this[NavigationMixin.Navigate]({
                type: 'comm__namedPage',
                attributes: {
                    name: this.url
                }
            });
        } else if (this.navigationType === 'standard__webPage') {
            this[NavigationMixin.Navigate]({
                type: 'standard__webPage',
                attributes: {
                    url: basePath + '/'+ this.url 
                }
            });
        } else {
            console.log(
                'Update Lightning Navigation Button Component to handle Navigation Type: ' +
                    this.navigationType
            );
        }
    }
}