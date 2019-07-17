const fetch = require('node-fetch');
const API_KEY = require('../../../apis/quandl/api-key/api_key');
const Header = require('./Header');

class Data {
    // this will function as the model corresponding to the financial data to be
    // used in the tabular buildouts for a company's finances

    constructor(company, ticker) {
        this.co = company;
        this.ticker = ticker;
        this.base_url = "https://www.quandl.com/api/v3/datatables/SHARADAR/";
        this.resource = "SF1.json";
        this.key = API_KEY;
    }

    async fetchAnnualData() {
        // fetch all annual financial statement data
        try {
            // construct the request URL
            const parameters = `?ticker=${this.ticker}` + '&dimension=MRY' + "&api_key=" + this.key;
            const url = this.base_url + this.resource + parameters;

            // and then make the request
            const raw = await fetch(url);

            // format it
            const json = await raw.json();

            // reduce the data to array of accounts with value property containing array of
            // amounts by year in descending order (i.e. most recent year to least)
            const reduced = reduce_data(json);

            // next, add in the appropriate headers
            const header = new Header();
            const headers = await header.fetchFormattedHeaderData();
            add_headers(reduced, headers); // mutates reduced data

            // lastly, push all of the financial statements, separated by statement type,
            // into a single array
            const inc = extract_statement_data(reduced, 'Income Statement');
            const bs = extract_statement_data(reduced, 'Balance Sheet');
            const cf = extract_statement_data(reduced, 'Cash Flow Statement');
            const metrics = extract_statement_data(reduced, 'Metrics');

            return {
                'income': inc,
                'balance': bs,
                'cashflow': cf,
                'metric': metrics
            }
        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }
}

/********************/
/* helper functions */
/********************/

function reduce_data(raw_data) {
    // this function takes in the json response from SF1 API for a given duration of
    // fiscal years for a particular company. it returns an array of objects, where
    // each object represents an account, having a property that contains all the
    // values for the above referenced duration of time, ordered by most recent fiscal
    // year to least

    const data = raw_data.datatable.data,
        columns = raw_data.datatable.columns;

    const tmp = [...columns];
    for (let i = 6; i < columns.length; i++) {
        tmp[i].values = [];
        for (let j = 0; j < data.length; j++) {
            tmp[i].values.push(data[j][i]);
        }
    }

    return tmp.slice(6);
}

function add_headers(reduced, columns) {
    // given a reduced array per the above function & given an array of object headers,
    // merge the according to the key equality: api_name === name. this will be an
    // in-place method in that it mutates the reduced data passed in, returning null

    for (let i = 0; i < columns.length; i++) {
        const header_name = columns[i].api_name;
        const actual_name = columns[i].name;
        const statement_type = columns[i].statement;
        for (let j = 0; j < reduced.length; j++) {
            const reduced_name = reduced[j].name;
            if (reduced_name === header_name) {
                reduced[j].account = actual_name;
                reduced[j].statement = statement_type;
            }
        }
    }
}

function extract_statement_data(data, stmt) {
    // given data of the reduced form as per the above functions, extract an array
    // of object accounts that correspond to the given statement

    const tmp = [];
    for (let i = 0; i < data.length; i++) {
        const datum = data[i];
        if (datum.statement === stmt) {
            tmp.push(datum);
        }
    }

    return tmp;
}

module.exports = Data;