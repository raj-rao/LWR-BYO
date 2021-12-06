const uiApiToDatatabletypes = {
    'Boolean': 'boolean',
    'Currency': 'currency',
    'Date': 'date',
    'DateTime': 'date-local',
    'Double': 'number',
    'Email': 'email',
    'Int': 'number',
    'Location': 'location',
    'Percent': 'percent',
    'Phone': 'phone',
    'Url': 'url'
};

export function convertType(type) {
    return uiApiToDatatabletypes[type] || 'text';
}