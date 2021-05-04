const express = require('express');
var cheerio = require("cheerio");
var request = require("request");

const router = express.Router();

const countryIbanLookup = {
    AD: ['EUR', 24], AE: ['AED', 23], AL: ['ALL', 28],
    AT: ['EUR', 20], AZ: ['AZN', 28], BA: ['BAM', 20],
    BE: ['EUR', 16], BG: ['BGN', 22], BH: ['BHD', 22],
    BR: ['BRL', 29], BY: ['BYN', 28], CH: ['CHF', 21],
    CR: ['CRC', 22], CY: ['EUR', 28], CZ: ['CZK', 24],
    DE: ['EUR', 22], DK: ['DKK', 18], DO: ['DOP', 28],
    EE: ['EUR', 20], ES: ['EUR', 24], FI: ['EUR', 18],
    FO: ['DKK', 18], FR: ['EUR', 27], GB: ['GBP', 22],
    GE: ['GEL', 22], GI: ['GIP', 23], GL: ['DKK', 18],
    GR: ['EUR', 27], GT: ['GTQ', 28], HR: ['HRK', 21],
    HU: ['HUF', 28], IE: ['EUR', 22], IL: ['ILS', 23],
    IQ: ['IQD', 23], IS: ['ISK', 26], IT: ['EUR', 27],
    JO: ['JOD', 30], KW: ['KWD', 30], KZ: ['KZT', 20],
    LB: ['LBP', 28], LC: ['XCD', 32], LI: ['CHF', 21],
    LT: ['EUR', 20], LU: ['EUR', 20], LV: ['EUR', 21],
    MC: ['EUR', 27], MD: ['MDL', 24], ME: ['EUR', 22],
    MK: ['MKD', 19], MR: ['MRU', 27], MT: ['EUR', 31],
    MU: ['MUR', 30], NL: ['EUR', 18], NO: ['NOK', 15],
    PK: ['PKR', 24], PL: ['PLN', 28], PS: ['ILS', 29],
    PT: ['EUR', 25], QA: ['QAR', 29], RO: ['RON', 24],
    RS: ['RSD', 22], SA: ['SAR', 24], SC: ['SCR', 31],
    SE: ['SEK', 24], SI: ['EUR', 19], SK: ['EUR', 24],
    SM: ['EUR', 27], TL: ['USD', 23], TN: ['TND', 24],
    TR: ['TRY', 26], UA: ['UAH', 29], VA: ['EUR', 22],
    VG: ['USD', 24], XK: ['EUR', 20]
};

router.get('/api/v1/balance', (req, res, _next) => {
    res.status(200).json(process.env.BALANCE);
});

const siteUrl = "https://wise.com/us/iban/checker";

router.get("/api/v1/bank/:iban", async (req, res, _next) => {

    try {
        const iban = req.params.iban;

        request.post({
            url: siteUrl,
            form: { 'userInputIban': iban },
        }, function (err, resp, body) {
            if (err) {
                return res.status(400).json({ code: 400, error: { status: "Bad Request", message: 'Invalid IBAN!' } });
            }

            var $ = cheerio.load(body);
            var title = $('title');

            if ('Error' === title.text()) {
                res.status(404).json({ code: 404, error: { status: "Not Found", message: 'Bank Doesnt Exist' } });

            }
            else {
                $('.details').each(function (i, element) {

                    let imageUrl = $(element).find('img').attr('src');
                    let bankName = $(element).find('img').attr('alt');

                    res.status(203).json({
                        "data": {
                            "bank": bankName,
                            "logo": imageUrl
                        }
                    })
                });
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: 500, error: { status: "Server Error", message: 'Internal Server Error!' } });
    }
});


function ibanVerfication(IBAN) {
    let countryCode = IBAN.substring(0, 2);
    let IBANLength = IBAN.length;

    if (countryIbanLookup[countryCode][1] == IBANLength) {
        return true
    } else {
        return false
    }
}

function ibanCurrency(IBAN) {
    let countryCode = IBAN.substring(0, 2);

    return {
        currency: countryIbanLookup[countryCode][0]
    }
}

router.post('/api/v1/transfer/:iban', (req, res, _next) => {
    try {
        let ibanVerficationResponse = ibanVerfication(req.params.iban);
        if (!ibanVerficationResponse) {
            console.log('ibanVerficationResponse')
            return res.status(400).json({ code: 400, error: { status: "Bad Request", message: 'Invalid IBAN!' } });
        }

        let ibanCurrencyResponse = ibanCurrency(req.params.iban);
        if (ibanCurrencyResponse.currency != req.body.currency) {
            return res.status(409).json({ code: 409, error: { status: "Bad Request", message: 'Currency does not match with the provided iban country!' } });
        }

        if (parseInt(req.body.amount) > parseInt(process.env.BALANCE)) {
            return res.status(402).json({ code: 402, error: { status: "Bad Request", message: 'Amount exceeds the available balance!' } });
        }

        process.env.BALANCE = process.env.BALANCE - req.body.amount;

        res.status(202).json({ balance: process.env.BALANCE, code: 202, message: 'Accepted!' });
    } catch (err) {
        res.status(500).json({ code: 500, error: { status: "Server Error", message: 'Internal Server Error!' } });
    }
});

module.exports = router;