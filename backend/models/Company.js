// this model will effectively create a company profile whose sole
// properties will be (1) Company Name, (2) Ticker & (3) Website.
// the idea is to build the profile given a search term for a company.

const fetch = require('node-fetch');
const API_KEY = require('../../apis/quandl/api-key/api_key');

class Company {
    constructor(search) {
        this.search = search;
        this.base_url = "https://www.quandl.com/api/v3/datatables/SHARADAR/";
        this.resource = "TICKERS";
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

        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }
}

module.exports = Company;