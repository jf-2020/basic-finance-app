// this model will effectively create a company profile whose sole
// properties will be (1) Company Name, (2) Ticker & (3) Website.
// the idea is to build the profile given a search term for a company.

const fetch = require('node-fetch');
const API_KEY = require('../../apis/quandl/api-key/api_key');

class Company {
    constructor(search) {
        this.search = search;
        this.base_url = "https://www.quandl.com/api/v3/datatables/SHARADAR/";
        this.resource = "TICKERS.json";
        this.key = API_KEY;
    }

    async fetchTickers() {
        // this function will act as the primary resource for accessing any ticker
        try {
            // construct the request URL
            const parameters = "?table=SF1" + "&api_key=" + this.key;
            const url = this.base_url + this.resource + parameters;

            // and then make the request
            const raw = await fetch(url);

            // format it
            const json = await raw.json();

            // extract company data
            const co_data = extract_data(json);

            return co_data;
        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }

    async fetchCompany() {
        // this function will search for a particular company's basic profile, namely
        // it's ticker, it's name & it's website given a basic search query

        try {
            // first, call fetchTickers()
            const tickers = await this.fetchTickers();

            // then, search for the particular company in question via it's search attribute
            const result = search_for_ticker_by_query(this.search, tickers);

            return result;
        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }
}

/********************/
/* helper functions */
/********************/

function extract_data(raw) {
    // given a raw json data object, whose relevant nested elements are arrays of soft
    // company data, extract into an array of objects containing each company's ticker
    // name & website
    const data_array = raw.datatable.data;
    const tmp = [];
    for (let i = 0; i < data_array.length; i++) {
        const co_obj = {};
        co_obj.ticker = data_array[i][2];
        co_obj.name = data_array[i][3];
        co_obj.website = data_array[i][data_array[i].length - 1];
        tmp.push(co_obj);
    }
    return tmp;
}

function search_for_ticker_by_query(query, companies) {
    // given a query, as taken from input element, and an array of company objects,
    // search through all company names, looking for longest substring match. if
    // such a match is found, return said company object, otherwise return an
    // indication string (e.g. 'not found')
    for (let i = 0; i < companies.length; i++) {
        const curr_co = companies[i].name;
        if (curr_co.includes(query)) {
            return companies[i];
        }
    }
    return "Not Found";
}

module.exports = Company;