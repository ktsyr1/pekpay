
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

import sp_today from 'res/apis/sp-today'
import lebanonprices from 'res/apis/lebanonprices'
import freecurrencyapi from 'res/apis/freecurrencyapi';
/**
 * 
 */
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
    let lastHalfHour = timeNow - (1000 * 60 * 15)
    // let lastHalfHour = timeNow - (1000 * 5)

    let currencies = await Currency

        .find({ type: 'local', date: { $gt: lastHalfHour } })
        .sort({ _id: -1 })
        .select(' -__v -_id')

    let data: any = await Verify(currencies, ['lb', 'sy', 'ir', 'de', 'iq'])
    res.status(200).json(data)
}
async function Verify(res: any, currencies: any) {
    /**  
     * find and filter lb
     * new currency
    */
    let data: any
    let filter: any = Filter(res, 'lb')
    /**
     * if filter.length === 0 
     * lb scrap 
     */
    // filter one
    if (filter.length === 0) data = await lebanonprices()
    else data = filter[0]


    let Currencies: any = []

    // map res to [one] 

    await Promise.all(currencies.map(async (currency: any) => {
        let filter2: any = Filter(res, currency)
        /**
         * if length > 0 
         * BUILD DATA 
         * push currency 
        */
        if (currency !== 'lb') {
            if (filter2.length > 0) {
                const build = Build(filter2[0], data)
                Currencies.push(build)
            } else { 
                if (currency === 'sy') {
                    let sy = await sp_today()
                    const buildsy: any = Build(sy, data)
                    Currencies.push(buildsy)
                } else if (currency === 'ir' || 'de' || 'iq') {
                    let ir = await freecurrencyapi(currency)
                    const buildsy: any = Build(ir, data)
                    Currencies.push(buildsy)
                }
            }
        }
    }))

    return Currencies
}
function Filter(target: any, One: string) {
    return target.filter((word: any) => word.name === One)
}
function Build(data: any, lb: any) {
    let { name, update, sell, buy, date, updown } = data
    // console.log(`lb to ${name} = ${(lb.sell / sell)}`);
    // console.log(`lb  = ${lb}`); 
    function toShart(a: any) {
        let str = a.toString()
        let i = str.indexOf(".")
        let Num = str.slice(0, i + 3)
        return Number(Num)
    }
    let NEW = {
        name: country[name].ar,
        date: new Date(date),
        update: new Date(update),
        updown,
        country_code: name,
        coinCode_ar: country[name].coinCode_ar,
        lb: {
            sell: toShart(lb.sell / sell),
            buy: toShart(lb.buy / buy)
        },
        doler: { sell, buy }
    }
    return NEW
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
