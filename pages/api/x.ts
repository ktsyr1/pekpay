
import type { NextApiRequest, NextApiResponse } from 'next'
import cloudscraper from 'cloudscraper'
//  jsdom 
import { JSDOM } from 'jsdom'
export default async function handler(req: NextApiRequest, res: NextApiResponse<any>) {
    // cloudscraper for pesktop 
    let { p } = req.query
    var options = {
        method: 'GET',
        url: `https://apkcombo.com/ar/${p}/download/apk`
    };

    cloudscraper(options)
        .then((data: any) => {
            // jsdom

            const { document } = (new JSDOM(data)).window
            let e: any = document.querySelector('ul.file-list li a') 
            let link: any =e.href

            res.status(200).json({ link })
        }).catch((err: any) => {
            res.status(500).json(err)
        })

    // const { data } = await cloudscraper.get(url )
    // res.status(200).json({ data: 'ok' })s
}


//     res.status(200).json({ data: '' })
// }  // end of handler
