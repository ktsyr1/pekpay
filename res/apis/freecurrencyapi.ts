import axios from "axios";
import { Currency } from 'res/mongoDB';
async function freecurrencyapi(q: string) {
    let URL: string = "https://freecurrencyapi.net/api/v2/latest?apikey=dae4db80-7936-11ec-9c16-9567237e8923"
    let { data } = await axios.get(URL)
    let sell: any = ''
    if (q === 'ir') sell = "IRR"
    else if(q === 'de') sell = "EUR"
    else if(q === 'iq') sell = "IQD"
    else if(q === 'sa') sell = "SAR"
    else if(q === 'ae') sell = "AED"
    let schema = {
        update: Number(data.query.timestamp),
        name: q,
        sell: data.data[sell],
        buy: data.data[sell],
        date: new Date().getTime(),
        type:'local',
        updown: "Equal"
    }
    let find: any = await Currency.findOne({ name:q, sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell') 
    
    if (schema.sell > find?.sell) schema['updown'] = 'up'
    else if (schema.sell < find?.sell) schema['updown'] = 'down'

    Currency.create(schema)
    return schema
}
export default freecurrencyapi