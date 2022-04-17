
import axios from 'axios'
import type { NextApiRequest, NextApiResponse } from 'next'
import lirarate from 'res/apis/lirarate'
import { Send } from 'res/app'
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    // axios get url
    let data = await lirarate()
    Send(res, data)
}

