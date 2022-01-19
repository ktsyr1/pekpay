import axios from "axios";
import { Currency } from 'res/mongoDB';
async function binance(q: string) {
    let URL: string = "https://api.binance.com/api/v1/ticker/allPrices"
    let { data } = await axios.get(URL)
    let sell: any = ''
    if (q === 'btc') sell = "BTCUSDT"
    else if (q === 'eth') sell = "ETHUSDT"
    let Data = data.filter((word: any) => word.symbol === q)
    let schema = {
        update: new Date().getTime(),
        name: q,
        sell: Data.price,
        buy: Data.price,
        date: new Date().getTime(),
        type: 'crypto',
        updown: "Equal"
    }
    let find: any = await Currency.findOne({ name: q, sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')

    if (schema.sell > find?.sell) schema['updown'] = 'up'
    else if (schema.sell < find?.sell) schema['updown'] = 'down'

    Currency.create(schema)
    return schema
}
export default binance