
import type { NextApiRequest, NextApiResponse } from 'next'
import cloudscraper from 'cloudscraper'
//  jsdom 
import { JSDOM } from 'jsdom'
import { Send } from 'res/app';
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    // cloudscraper for pesktop 
    let { p } = req.query
    var options = {
        method: 'GET',
        url: `https://apkcombo.com/ar/app.botqa.twa/download/apk`
    };

    cloudscraper(options)
        .then((data: any) => {
            // jsdom

            const { document } = (new JSDOM(data)).window
            let e: any = document.querySelector('ul.file-list li a')
            let link: any = e.href
            Send(res, { link })
        }).catch((err: any) => {
            Send(res, { err }, 500)
        })
}

