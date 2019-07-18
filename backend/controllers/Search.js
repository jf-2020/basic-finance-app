const Company = require('../models/Company');

exports.searchForCompany_get = (req, res) => {
    res.render('search',
        {
            title: 'Company Search'
        }
    );
}

exports.searchForCompany_post = async (req, res) => {
    const query_term = req.body.query;

    // first, build out the company via the search query
    const searchFor = new Company(query_term);

    // then, go and find it
    const result = await searchFor.fetchCompany();

    res.redirect('/co' + '/' + result.ticker);
}