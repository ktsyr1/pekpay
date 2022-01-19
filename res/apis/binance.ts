import axios from "axios";
import { Currency } from 'res/mongoDB';
async function binance(q: string) {
    let URL: string = "https://api.binance.com/api/v1/ticker/allPrices"
    let { data } = await axios.get(URL)
    let sell: any = ''
    if (q === 'btc') sell = "BTCUSDT"
    else if (q === 'ethereum') sell = "ETHUSDT"
    else if (q === 'BNB') sell = "BNBUSDT"
    else if (q === 'XRP') sell = "XRPUSDT"
    let Data = data.filter((word: any) => {
        return word.symbol === sell
    })
    let schema = {
        update: new Date().getTime(),
        name: q,
        sell: Number( Data[0].price),
        buy:  Number( Data[0].price),
        date: new Date().getTime(),
        type: 'crypto',
        updown: "Equal"
    }
    console.log({Data});
    
    let find: any = await Currency.findOne({ name: q, sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')

    if (schema.sell > find?.sell) schema['updown'] = 'up'
    else if (schema.sell < find?.sell) schema['updown'] = 'down'

    // Currency.create(schema)
    return schema
}
export default binance