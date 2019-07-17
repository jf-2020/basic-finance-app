const express = require('express');
const router = express.Router();
const Data = require('../models/Financial/Data');

/* GET home page. */
router.get('/', async function (req, res, next) {
    const dataObj = new Data('Apple', 'AAPL');
    const { income, balance, cashflow } = await dataObj.fetchAnnualData();

    // extract account names as an array and also extract amounts in each 
    // account for each year as an array
    const inc_accts = [],
        inc_amnts = [];
    income.forEach(obj => {
        inc_accts.push(obj.account);
        inc_amnts.push(obj.values);
    });

    // do the same for the balance sheet
    const bs_accts = [],
        bs_amnts = [];
    balance.forEach(obj => {
        bs_accts.push(obj.account);
        bs_amnts.push(obj.values);
    });

    // and lastly, the same for the cash flow statement
    const cf_accts = [],
        cf_amnts = [];
    cashflow.forEach(obj => {
        cf_accts.push(obj.account);
        cf_amnts.push(obj.values);
    });

    res.render('index',
        {
            title: 'Tabulate Statements',
            accounts_inc: inc_accts,
            accounts_bs: bs_accts,
            accounts_cf: cf_accts,
            amounts_inc: inc_amnts,
            amounts_bs: bs_amnts,
            amounts_cf: cf_amnts

        });

    // res.render('index',
    //     {
    //         title: 'Tabulate Statements',
    //         inc: income,
    //         bs: balance,
    //         cf: cashflow
    //     });

    // res.sendStatus(200);
});

module.exports = router;
