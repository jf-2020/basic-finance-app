const fetch = require('node-fetch');
const API_KEY = require('../../../apis/quandl/api-key/api_key');

class Header {
    // this will function as the model corresponding to the column headers to be used
    // in the display of financial statements

    constructor() {
        this.base_url = "https://www.quandl.com/api/v3/datatables/SHARADAR/";
        this.resource = "INDICATORS.json";
        this.key = API_KEY;
    }

    async fetchAllHeaders() {
        // will fetch all financial statement indicators

        try {
            // construct the request URL
            const parameters = "?table=SF1" + "&api_key=" + this.key;
            const url = this.base_url + this.resource + parameters;

            // and then make the request
            const raw = await fetch(url);

            // format it
            const json = await raw.json();
            const formatted = format_data(json);

            // extract the relevant headers
            const inc = 'Income Statement',
                bs = 'Balance Sheet',
                cf = 'Cash Flow Statement';
            const income_statement_headers = get_statement_headers(formatted, inc),
                balance_sheet_headers = get_statement_headers(formatted, bs),
                cash_flow_statement_headers = get_statement_headers(formatted, cf);

            return ({
                income_statement: income_statement_headers,
                balance_sheet: balance_sheet_headers,
                cash_flow_statement: cash_flow_statement_headers
            });
        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }

    async fetchFormattedHeaderData() {
        // fetches and formats header data per helper function below

        try {
            // construct the request URL
            const parameters = "?table=SF1" + "&api_key=" + this.key;
            const url = this.base_url + this.resource + parameters;

            // and then make the request
            const raw = await fetch(url);

            // format it
            const json = await raw.json();
            const formatted = format_data(json);

            return formatted;
        } catch (error) {
            console.log("Error:", error.message);
            return error.message;
        }
    }
}

/********************/
/* helper functions */
/********************/

function format_data(data) {
    // this function abstracts the data processing to be used as callback in fetch.
    // essentially, it returns an array of objects for each indicator, whose properties
    // correspond to the self-descriptive names given below.
    const to_map = data.datatable.data;
    const formatted_data = to_map.map(indicator => {
        let tmp = indicator[5].split(']');
        tmp = tmp[0].substr(1);

        return (
            {
                api_name: indicator[1],
                name: indicator[4],
                description: indicator[5],
                data_type: indicator[6],
                statement: tmp
            }
        )
    });
    return formatted_data;
};

function get_statement_headers(data, statement) {
    // this function extracts all the statement headers from the data array per above
    // corresponding to the statement arg passed in
    const stmt = data.map(column => {
        return (
            column.statement === statement ? column.name : null
        )
    });
    const ret_val = stmt.filter(item => {
        return item !== null
    });
    return ret_val;
};

module.exports = Header;