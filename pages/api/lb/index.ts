import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';
import { Send } from 'res/app';
import lirarate from 'res/apis/lirarate';

type Data = { data: any }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 60 * 15)
    let NEW: any
    let data = await Currency
        .findOne({ name: 'lb', date: { $gt: lastHalfHour } })
        .select(' -__v -_id')
    if (!data) NEW = await lirarate()
    else NEW = data
    let Data: any = [{
        "name": "ليرة لبناني",
        "update": new Date(NEW.update),
        "date": new Date(NEW.date),
        "sell": NEW.sell,
        "buy": NEW.buy,
        "updown": NEW.updown,
        type: NEW.type

    }]
    Send(res, Data)
} 
