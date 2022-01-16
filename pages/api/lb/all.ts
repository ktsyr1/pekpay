import sp_today from 'res/apis/sp-today'
import lebanonprices from 'res/apis/lebanonprices'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

type Data = { data: any }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 5 /** 60 * 30*/)

    let currencies = await Currency.find({ date: { $gt: lastHalfHour } })
    let data = await Verify(currencies, ['lb', 'sy'])
 
    res.status(200).json(data)
}
async function Verify(res: any, currencies: any) {
    let data: any = []
    let lb = await lebanonprices()
    let sy = await sp_today()
    console.log({ sy });
    await Promise.all(currencies.map(async (currency: any) => {
        let filter = res.filter((word: any) => word.name === currency);
        if (filter.length > 0) data.push(filter[0])
        else { 
            if (currency === 'lb') data.push(lb)
            else if (currency === 'sy') data.push(sy)
        }
    }))
    return data
}
let aaa =
{
    update: 1642324554795,
    name: 'sy',
    lb: {
        sell: 6.78,
        buy: 6.72,
    },
    doler: {
        sell: 3680,
        buy: 3640,
    },
    date: 1642324705367,
    updown: 'down'
}