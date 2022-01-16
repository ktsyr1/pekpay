import sp_today from 'res/apis/sp-today'
import lebanonprices from 'res/apis/lebanonprices'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

interface Data {
    name: string,
    update: Number,
    date: Number,
    sell: Number,
    buy: Number,
    updown: string,
    currency: any
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 60 * 30)
    // let lastHalfHour = timeNow - (1000 * 5)

    let currencies = await Currency
        .find({ date: { $gt: lastHalfHour } })
        .sort({ _id: -1 })
        .select(' -__v -_id')

    let data = await Verify(currencies, ['lb', 'sy'])

    res.status(200).json(data)
}
async function Verify(res: any, currencies: any) {
    /**  
     * find and filter lb
     * new currency
    */
    let data
    let filter: any = Filter(res, 'lb')
    /**
     * if filter.length === 0 
     * lb scrap 
     */
    if (filter.length === 0) data = await lebanonprices()
    else data = filter[0]

    let currency: any = []

    // map res to [one]
    await Promise.all(currencies.map(async (currency: any) => {
        let filter2 = Filter(res, currency)

        if (filter2.length > 0) {
            const build = Build(filter2[0])
            currency.push(build)
        } else {
            if (currency === 'lb') {
                console.log(currency);

                let lb = await lebanonprices()
                const buildlb = Build(lb)
                currency.push(buildlb)
            } else if (currency === 'sy') {
                let sy = await sp_today()
                const buildsy: any = Build(sy)
                currency.push(buildsy)
            }
            // full.currency.push(filter2[0])
        }

    }))
    let { name, update, sell, buy, date, updown } = data
    let full = {
        name, date, update, sell, buy, updown, currency
    }
    // filter one

    /**
     * if length > 0 
     * BUILD DATA 
     * push currency 
    */
    /**
     * 
     */
    return full
}
function Filter(target: any, One: string) {
    return target.filter((word: any) => word.name === One)
}
function Build(data: any) {
    let { name, update, sell, buy, date, updown } = data

    let NEW = {
        name, date, update, updown,
        lb: { sell, buy },
        doler: { sell, buy }
    }
    return NEW
} 