
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

import binance from 'res/apis/binance';
import coingecko from 'res/apis/coingecko';
interface RES {
    name: string,
    update: Number,
    date: Number,
    sell: Number,
    buy: Number,
    updown: string,
    currency: any
}
interface Data {
    data: any
}
/**
 *  add to     Dogcoin  Polygon 
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 60 * 5)
    // let lastHalfHour = timeNow - (1000 * 5)

    let currencies = await Currency
        .find({ type: 'crypto', date: { $gt: lastHalfHour } })
        .sort({ _id: -1 })
        .select(' -__v -_id')

    let data: any = await Verify(currencies, ['bitcoin', 'ethereum', 'BNB', 'XRP', 'dogecoin', 'matic-network'])
    res.status(200).json(data)
}

async function Verify(res: any, currencies: any) {
    let data: any

    let Currencies: any = []
    console.log(currencies);

    await Promise.all(currencies.map(async (currency: any) => {
        let filter = Filter(res, currency)

        if (filter.length > 0) {
            Currencies.push(filter[0])
        } else {
            let IF = (srt: string) => srt === currency ? true : false
            if (IF('bitcoin') || IF('XRP') || IF('BNB') || IF('ethereum')) {

                console.log(currency);
                let btc = await binance(currency)
                Currencies.push(btc)
            } else if (currency === 'dogecoin' || 'matic-network') {
                console.log(currency);

                let gecko = await coingecko(currency)
                Currencies.push(gecko)
            }
        }

    }))

    return Currencies
}
function Filter(target: any, One: string) {
    return target.filter((word: any) => word.name === One)
}
let country: any = {
    lb: {
        coinCode_ar: 'ل.ل',
        ar: "ليرة لبنانية"
    },
    sy: {
        coinCode_ar: "ل.س",
        ar: "ليرة سورية"
    },
    ir: {
        coinCode_ar: "﷼",
        ar: "ريال ايراني"
    },
    de: {
        coinCode_ar: "€",
        ar: "يورو"
    },
    iq: {
        coinCode_ar: "د.ع",
        ar: "دينار عراقي"
    },
}
