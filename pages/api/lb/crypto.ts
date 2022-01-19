
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

import sp_today from 'res/apis/sp-today'
import lebanonprices from 'res/apis/lebanonprices'
import freecurrencyapi from 'res/apis/freecurrencyapi';
import binance from 'res/apis/binance';

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
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 60 * 5)
    // let lastHalfHour = timeNow - (1000 * 5)

    let currencies = await Currency
        .find({ type: 'crypto', date: { $gt: lastHalfHour } })
        .sort({ _id: -1 })
        .select(' -__v -_id')

    let data: any = await Verify(currencies, ['btc', 'eth'])
    res.status(200).json(data)
}

async function Verify(res: any, currencies: any) {
    let data: any

    let Currencies: any = []

    await Promise.all(currencies.map(async (currency: any) => {
        let filter = Filter(res, currency)
        // console.log(currency);
        // console.log(filter);
        if (filter.length > 0) {
            // const build = Build(filter2[0], data)
            // Currencies.push(build)
        } else {
            //     // if (currency === 'lb') {
            //     //     let lb = await lebanonprices()
            //     //     const buildlb = Build(lb, data)
            //     //     Currencies.push(buildlb)
            //     // } else
            if (currency === 'btc' || 'eth') {
                console.log(currency);
                // let btc = await binance('btc')
                // Currencies.push(btc)
            } else if (currency === 'eth') {
                //         let ir = await freecurrencyapi('ir')
                //         const buildsy: any = Build(ir, data)
                //         Currencies.push(buildsy)
                //     } else if (currency === 'de') {
                //         let de = await freecurrencyapi('de')
                //         const buildsy: any = Build(de, data)
                //         Currencies.push(buildsy)
                //     } else if (currency === 'iq') {
                //         let iq = await freecurrencyapi('iq')
                //         const buildsy: any = Build(iq, data)
                //         Currencies.push(buildsy)
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
