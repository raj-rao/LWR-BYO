public with sharing class ManagedContentController {
    @AuraEnabled(cacheable=true)
    public static Map<String, ConnectApi.ManagedContentNodeValue> getContent(
        String contentId,
        Integer page,
        Integer pageSize,
        String language,
        String filterby
    ){
        try {
            String networkId = Network.getNetworkId();
            ConnectApi.ManagedContentVersionCollection contentCollection = ConnectApi.ManagedContent.getManagedContentByContentKeys(
                networkId, 
                new List<String>{contentId},
                0,
                1,
                language,
                filterby, 
                false
            );
            return contentCollection.items[0].contentNodes;        
        } catch (connectApi.ConnectApiException e) {
            System.debug('Error message: '+ e);
            Map<String, ConnectApi.ManagedContentNodeValue> mcnvMap = new Map<String, ConnectApi.ManagedContentNodeValue>();
            return mcnvMap;
        }
    }
}
