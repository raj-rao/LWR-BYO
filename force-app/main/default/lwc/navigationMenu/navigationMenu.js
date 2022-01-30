import { LightningElement, api, wire, track } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import { loadStyle, loadScript } from 'lightning/platformResourceLoader'; //added by Raj Rao on 7/28/2021
import boxIconStyles from '@salesforce/resourceUrl/boxIconsCSS';
import azInsuranceLogo from '@salesforce/resourceUrl/azinsurancelogo';

import { NavigationMixin } from 'lightning/navigation';
import basePath from '@salesforce/community/basePath';

import getNavigationMenuItems from '@salesforce/apex/NavigationMenuItemsController.getNavigationMenuItems';
import isGuest from '@salesforce/user/isGuest';

/**
 * This is a custom LWC navigation menu component.
 * Ensure the Guest user profile has access to the NavigationMenuItemsController apex class.
 */
//export default class NavigationMenu extends LightningElement {
export default class NavigationMenu extends NavigationMixin(LightningElement) {
    /**
     * the menuName (NavigationMenuLinkSet.MasterLabel) exposed by the .js-meta.xml
     */
    @api menuName;

    /**
     * the menu items when fetched by the NavigationItemsController
     */
    @track menuItems = [];

    /**
     * if the items have been loaded
     */
    @track isLoaded = false;

    /**
     * if the boxIconsCSS resource has been loaded
     */
     @track isCSSLoaded = false;

    /**
     * the error if it occurs
     */
    @track error;

    /**
     * the published state of the site, used to determine from which schema to 
     * fetch the NavigationMenuItems
     */
    publishedState;
    
    /**
     * navlinks class querySelector 
     */
    navLinks;

    /**
     * which submenu is currently open
     */
    submenuParams = [];

    /**
     * is this a Guest User
     */
     isGuestUser = isGuest;
    
    /**
     * the PageReference object used by lightning/navigation
     */
     pageReference;

     /**
     * the site logo from resourceURL
     */
      logo = azInsuranceLogo;


    /**
     * Using a custom Apex controller, query for the NavigationMenuItems using the
     * menu name and published state.
     * 
     * The custom Apex controller is wired to provide reactive results. 
     */
    @wire(getNavigationMenuItems, { 
        menuName: '$menuName',
        publishedState: '$publishedState'
    })

    wiredMenuItems({error, data}) {
        if (data && !this.isLoaded) {
            this.menuItems = data.map((item, index) => {
                return {
                    target: item.Target,
                    indx: index,
                    id:  item.Id, 
                    label: item.Label,
                    parentId: item.ParentId,
                    position: item.Position,
                    defaultListViewId: item.DefaultListViewId,
                    type: item.Type,
                    accessRestriction: item.AccessRestriction
                }
            }).filter(item => {
                // Only show "Public" items if guest user
                return item.accessRestriction === "None"
                        || (item.accessRestriction === "LoginRequired" && !isGuestUser);
            });
            
            // assign submenus as children of menu item
            var navMenuTree = this.unflatten(this.menuItems);
            this.menuItems = navMenuTree;
            for(let c =0;c<this.menuItems.length;c++){
                if(this.menuItems[c].children.length){
                    this.menuItems[c].parentIndx = this.menuItems[c].indx;
                    this.menuItems[c].hasChildren = true;
                    this.menuItems[c].subMenuClass = 'show'+this.menuItems[c].indx+'-sub-menu sub-menu';
                    this.menuItems[c].arrowClass = 'bx bxs-chevron-down arrow'+this.menuItems[c].indx + ' arrow ';
                }
            }  

            this.error = undefined;
            this.isLoaded = true;
            this.searchInputBoxClass = "input-box";
        } else if (error) {
            this.error = error;
            this.menuItems = [];
            this.isLoaded = true;
        }
    }
    
    renderedCallback() {
        Promise.all([
          loadStyle(this, boxIconStyles),
          //loadStyle(this, googleFontsCSS + '/googleFontsCSS.css')
        ]).then(() => {
            this.isCSSLoaded = true;
        })
    }
 
    /**
     * Using the CurrentPageReference, check if the app is 'commeditor'.
     * 
     * If the app is 'commeditor', then the page will use 'Draft' NavigationMenuItems. 
     * Otherwise, it will use the 'Live' schema.
    */
    @wire(CurrentPageReference)
    setCurrentPageReference(currentPageReference) {
        const app = currentPageReference && currentPageReference.state && currentPageReference.state.app;
        if (app === 'commeditor') {
            this.publishedState = 'Draft';
        } else {
            this.publishedState = 'Live';
        }
    }
    
    unflatten(arr) {
        var tree = [],
            mappedArr = {},
            arrElem,
            mappedElem;

        // First map the nodes of the array to an object -> create a hash table.
        for(var i = 0, len = arr.length; i < len; i++) {
        arrElem = arr[i];
        mappedArr[arrElem.id] = arrElem;
        mappedArr[arrElem.id]['children'] = [];
        }


        for (var id in mappedArr) {
            if (mappedArr.hasOwnProperty(id)) {
                mappedElem = mappedArr[id];
                // If the element is not at the root level, add it to its parent array of children.
                if (mappedElem.parentId) {
                    mappedElem.parentIndx = mappedArr[mappedElem['parentId']].indx;//NEW LINE
                    mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
                }
                // If the element is at the root level, add it to first level elements array.
                else {
                    tree.push(mappedElem);
                }
            }
        }
        return tree;
    }
    
    connectedCallback() {
        document.addEventListener('click', this._handler = this.close.bind(this));
    }
    
    disconnectedCallback() {
        document.removeEventListener('click', this._handler);
    }
    
    /**
     * close the submenu's if click is detected outside of the boundries of this component 
    */
    close() { 
        this.hideSubMenu(null);

        //close the Searh Box if a click is detected outside of the boundries of this component 
        //by firing the child component c-search-bar hideSearchBox() method
        this.template.querySelector("c-search-bar").hideSearchBox();

        //close the user profile if a click is detected outside of the boundries of this component
        //by firing the child component c-user-profile hideUserProfileMenu() method
        if(!this.isGuestUser){
            this.template.querySelector("c-user-profile").hideUserProfileMenu();
        }
    }

    /**
    /* search-box open close
    */
    
    handleClick(event) {
        //close any open submenus outside of the active submenu
        this.hideSubMenu(null);
        //close the user profile component by firing the child component c-user-profile hideUserProfileMenu() method
        if(!this.isGuestUser){
            this.template.querySelector("c-user-profile").hideUserProfileMenu();
        }
        //close the searhBox if open by firing the child component c-search-bar hideSearchBox() method
        this.template.querySelector("c-search-bar").hideSearchBox();
        // use the NavigationMixin from lightning/navigation to perform the navigation.
        event.stopPropagation();
        event.preventDefault();
         //if sidebar is open ... hide sidebar when submenu item is clicked
         this.navLinks = this.template.querySelector(".nav-links");
         if(this.navLinks.style.left === "0px"){
            this.hideSideBar();
        }
        //redirect to Home page by pointing to basePath
        this.pageReference = {
            type: 'standard__webPage',
            attributes: {
                url: basePath
            }
        };
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        }
    }
    
    /**
    /* search-box open close
    */
    
    displaySearchBox() {
        var navbar = this.template.querySelector(".navbar");
        var searchBox = this.template.querySelector(".search-box .bx-search");
        navbar.classList.toggle("showInput");
        if(navbar.classList.contains("showInput")){
            searchBox.classList.replace("bx-search" ,"bx-x");
        }else {
            searchBox = this.template.querySelector(".search-box .bx-x");
            searchBox.classList.replace("bx-x" ,"bx-search");
        }
    }
    
    /**
    /* show sidebar
    */
    showSideBar(){
        this.navLinks = this.template.querySelector(".nav-links");
        this.navLinks.style.left = "0";
        /*close all sub menus if side bar is opened*/ 
        let subMenus = this.template.querySelectorAll('.sub-menu');
        for(let m=0; m<subMenus.length; m++){
            if(subMenus[m].classList.contains('showSubMenu')){
                subMenus[m].classList.toggle('showSubMenu')
            }
        }
        this.resetChevrons();
    }

    /**
    /* close sidebar
    */
    hideSideBar(){
        this.navLinks.style.left = "-100%";
        /*close all sub menus if side bar is closed*/ 
        var subMenus = this.template.querySelectorAll('.sub-menu');
        for(let m=0; m<subMenus.length; m++){
            if(subMenus[m].classList.contains('showSubMenu')){
                subMenus[m].classList.toggle('showSubMenu')
            }
        }
        /*reset all arrows if side bar is opened*/
       this.resetChevrons();
    }

    /**
    /*Open submenu via arrow click
    */
    showSubMenu(event){
        event.stopPropagation();//NEW LINE
        let menuIndx=event.currentTarget.getAttribute("data-id");
        let subMenuClass = '.show'+menuIndx+'-sub-menu';
        let arrowClass = '.arrow'+menuIndx;
        this.template.querySelector(arrowClass).classList.toggle('transformArrow');
        this.template.querySelector(subMenuClass).classList.toggle('showSubMenu');
        
        //set submenuParams
        this.submenuParams.push(menuIndx);
        
        //close any open submenus outside of the active submenu
        this.hideSubMenu(menuIndx);
        
        //close the user profile menu if open by firing the child component c-user-profile hideUserProfileMenu() method
        if(!this.isGuestUser){
            this.template.querySelector("c-user-profile").hideUserProfileMenu();
        }

        //close the searhBox if open by firing the child component c-search-bar hideSearchBox() method
        this.template.querySelector("c-search-bar").hideSearchBox();
        
        return false;
    }

    hideSubMenu(menuIndx){
        //get unique values
        const uniqueMenuIndx = Array.from(new Set(this.submenuParams));
        uniqueMenuIndx.forEach((value) => {
            //close any open submenus outside of the active submenu
            if(menuIndx !== null && value != menuIndx){
                if(this.template.querySelector('.show'+value+'-sub-menu').classList.contains('showSubMenu')){
                    this.template.querySelector('.arrow'+value).classList.toggle('transformArrow');
                    this.template.querySelector('.show'+value+'-sub-menu').classList.toggle('showSubMenu');
                }
            }else if(menuIndx === null && value != menuIndx){
                //hideSubMenu was called from search box or user profile components
                if(this.template.querySelector('.show'+value+'-sub-menu').classList.contains('showSubMenu')){
                    this.template.querySelector('.arrow'+value).classList.toggle('transformArrow');
                    this.template.querySelector('.show'+value+'-sub-menu').classList.toggle('showSubMenu');
                }
            }
        })
    }
    /**
     * Open submenu via event
     * handler for event dispatched via navigationMenuItem child component
     */
    handleSubMenuEvent(event){
        let hasChildren = event.detail.hasChildren;
        console.log('HAS CHILDREN:'+hasChildren);
        if(hasChildren){
            let menuIndx = event.detail.menuIndx;
            let parentId = event.detail.parentId;
            let subMenuClass = '.show'+menuIndx+'-sub-menu';
            let arrowClass = '.arrow'+menuIndx;
            this.template.querySelector(arrowClass).classList.toggle('transformArrow');
            this.template.querySelector(subMenuClass).classList.toggle('showSubMenu');
            //set submenuParams
            this.submenuParams.push(menuIndx);
            //close any open submenus outside of the active submenu
            this.hideSubMenu(menuIndx);
        }else{
            // we know this menu item does not have children. Close any sub menus that are open
            this.hideSubMenu(null);
            //if sidebar is open ... hide sidebar when submenu item is clicked
            this.navLinks = this.template.querySelector(".nav-links");
            if(this.navLinks.style.left === "0px"){
                this.hideSideBar();
            }
        }

        //close the user profile menu if open by firing the child component c-user-profile hideUserProfileMenu() method
        if(!this.isGuestUser){
            this.template.querySelector("c-user-profile").hideUserProfileMenu();
        }
        //close the searhBox if open by firing the child component c-search-bar hideSearchBox() method
        this.template.querySelector("c-search-bar").hideSearchBox();

    }
    
    hideUserProfileSearchSubMenu(event){
        //close the user profile menu if open by firing the child component c-user-profile method
        if(!this.isGuestUser && event.detail === 'c-user-profile') {   
            this.template.querySelector(event.detail).hideUserProfileMenu();
        }
        //close the searhBox if open
        if(event.detail === 'c-search-bar') { 
            this.template.querySelector(event.detail).hideSearchBox();
        }
        //close any open submenus outside of the active submenu
        this.hideSubMenu(null);
    }

    resetChevrons(){
        let subMenuArrows = this.template.querySelectorAll('.arrow');
        for(let a=0; a<subMenuArrows.length; a++){
            if(subMenuArrows[a].classList.contains('transformArrow')){
                subMenuArrows[a].classList.toggle('transformArrow')
            }
        }
    }
}