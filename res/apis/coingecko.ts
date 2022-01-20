import axios from "axios";
import { Currency } from 'res/mongoDB';
async function coingecko(q: string) {
    let URL: string = "https://api.coingecko.com/api/v3/coins/" + q
    let { data } = await axios.get(URL)
    // let sell: any = ''
    // if (q === 'bitcoin') sell = "BTCUSDT"
    // else if (q === 'ethereum') sell = "ETHUSDT"
    // else if (q === 'BNB') sell = "BNBUSDT"
    // else if (q === 'XRP') sell = "XRPUSDT"

    let Data = data?.market_data?.current_price.usd
    

    let schema = {
        update: new Date().getTime(),
        name: q,
        sell: Data,// Number(Data),
        buy: Data,// Number(Data),
        date: new Date().getTime(),
        type: 'crypto',
        updown: "Equal"
    } 
    let find: any = await Currency.findOne({ name: q, sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')

    if (schema.sell > find?.sell) schema['updown'] = 'up'
    else if (schema.sell < find?.sell) schema['updown'] = 'down'

    // Currency.create(schema)
    return schema
}
export default coingecko