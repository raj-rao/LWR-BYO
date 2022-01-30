public with sharing class GlobalSearchController {

    @AuraEnabled(Cacheable=true)
    public static List<SObject> searchInObject(String searchString, String objectApiName) {
        List<List<SObject>> results = search.query(
            'FIND \'' + String.escapeSingleQuotes(searchString) + '*\' ' + 
            'IN ALL FIELDS RETURNING ' + String.escapeSingleQuotes(objectApiName) + ' (Id, Name, Type)'
        );
        return results.get(0);
    }
}