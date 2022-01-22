import sp_today from 'res/apis/sp-today'
import lebanonprices from 'res/apis/lebanonprices'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Currency } from 'res/mongoDB';

type Data = { msg: any }
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) { 
    res.status(200).json({msg: 'dane update'})
} 