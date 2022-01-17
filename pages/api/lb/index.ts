// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import lebanonprices from 'res/apis/lebanonprices'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

type Data = { data: any }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 60 * 30)
    let NEW: any
    let data = await Currency
        .findOne({ name: 'lb', date: { $gt: lastHalfHour } })
        .select(' -__v -_id')
    if (!data) NEW = await lebanonprices()
    else NEW = data
    let Data: any = [{
        "name": "ليرة لبناني",
        "update": new Date(NEW.update),
        "date": new Date(NEW.date),
        "sell": NEW.sell,
        "buy": NEW.buy,
        "updown": NEW.updown
    }]
    res.status(200).json(Data)
} 
