import axios from "axios";
import { Currency } from 'res/mongoDB';
async function freecurrencyapi(q: string) {
    let URL: string = "https://freecurrencyapi.net/api/v2/latest?apikey=dae4db80-7936-11ec-9c16-9567237e8923"
    let { data } = await axios.get(URL)
    let sell: any = ''
    if (q === 'ir') sell = "IRR"
    let schema = {
        update: Number(data.query.timestamp),
        name: q,
        sell: data.data[sell],
        buy: data.data[sell],
        date: new Date().getTime(),
        updown: "Equal"
    }
    let find: any = await Currency.findOne({ name: 'ir', sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')
    if (schema.sell > find.sell) schema['updown'] = 'up'
    else if (schema.sell < find.sell) schema['updown'] = 'down'

    Currency.create(schema)
    return schema
}
export default freecurrencyapi