const API_ENDPOINT_URLS = {
    'genes': 'https://moalmanac.org/api/genes',
    'diseases': 'https://moalmanac.org/api/diseases',
    'predictive_implications': 'https://moalmanac.org/api/predictive_implications',
    'therapies': 'https://moalmanac.org/api/therapies',
    'feature_definitions': 'https://moalmanac.org/api/feature_definitions'
}

// load data objects from remote JSON
function getJSONSearchSet(url, value_handler, callback) {
    // value_handler must return an dict with keys id and text
    return $.getJSON(url, function(data) {
        let search_set = Object;
        search_set = [];
        $.each(data, function(index, value) {
            search_set.push(value_handler(value));
        });

        callback(search_set);
    });
}

function getSearchSet(api_endpoint, handler, callback) {
    return getJSONSearchSet(API_ENDPOINT_URLS[api_endpoint], handler, callback);
}