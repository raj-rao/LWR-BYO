/**
 * A basic controller for fetching NavigationMenuItems.
 */
global with sharing class NavigationMenuItemsController {
    public NavigationMenuItemsController() {}

    /**
     * Perform two SOQL queries to determine all the children NavigationMenuItems
     * belonging to the provided menuName and publishedState. This example uses the
     * NavigationLinkSet.MasterLabel for the menuName. One could also use the
     * NavigationLinkSet.Id to ensure referential integrity if the MasterLabel changes.
     * 
     * NavigationLinkSet contains both Draft and Live versions of the NavigationMenuItems.
     * Use the publishedState enumeration to filter between them.
     * 
     * Cacheable = true allows this function to be wired.
     */
    @AuraEnabled(cacheable=true)
    public static List<NavigationMenuItem> getNavigationMenuItems(String menuName, String publishedState) {
        List<NavigationMenuItem> myList = new List<NavigationMenuItem>();
        List<NavigationMenuItem> navMenuList = new List<NavigationMenuItem>();
        System.assert(menuName != null);
        System.assert(publishedState != null);
        
        String networkId = Network.getNetworkId();
        System.assert(networkId != null);

        // find the link set belonging to the navigation menuName and active networkId
        List<NavigationLinkSet> linkSets = [
            SELECT Id 
            FROM NavigationLinkSet
            WHERE MasterLabel = :menuName AND NetworkId = :networkId
        ];

        System.assert(linkSets.size() == 1);
        Id linkSetId = linkSets.get(0).Id;

        // collect all the menu items belonging to the link set
        // published state is either Draft or Live
        //return [SELECT toLabel(Label), Target, Type, DefaultListViewId, AccessRestriction, Id,
        
        myList = [SELECT toLabel(Label), Target, Type, DefaultListViewId, AccessRestriction, Id,
                ParentId,
                Position,
                Status,
                TargetPrefs
            FROM NavigationMenuItem
            WHERE NavigationLinkSetId = :linkSetId
            AND Status = :publishedState 
            ORDER BY ParentId, Position
        ];
        return myList;
        /*
        String tempParentId = '';
        String tempId = ''; 
        for (integer i=0; i<myList.size(); i++) {
            if(myList[i].Type == 'MenuLabel' || myList[i].ParentId == null){ // this could be a menu label with sub level navigation;
                navMenuList.add(myList[i]);
                for (integer j=0; j<myList.size(); j++) {
                    if(myList[j].ParentId == myList[i].Id){
                        navMenuList.add(myList[j]);
                    }
                }
            }
        }
    return navMenuList;*/
    }
}
