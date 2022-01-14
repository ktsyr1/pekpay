// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import lebanonprices from 'res/apis/lebanonprices'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

type Data = { data: any }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    let timeNow = new Date().getTime()
    let lastHalfHour = timeNow - (1000 * 10 /** 60 * 30*/) 

    let data = await Currency.findOne({ name: 'lb', date: { $gt: lastHalfHour } })
    if (!data) data = await lebanonprices()

    res.status(200).json(data)
} 