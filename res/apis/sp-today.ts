import axios from "axios";
import { Currency } from 'res/mongoDB';
async function sp_today() {
    let URL: string = "https://sp-today.com/app_api/cur_idlib.json"
    let { data } = await axios.get(URL)
    let filter = data.filter((word: any) => word.name === 'USD')[0]

    let schema = {
        update: new Date().getTime(),
        name: 'sy',
        sell: Number(filter.bid),
        buy: Number(filter.ask),
        date: new Date().getTime(),
        type:'local',
        updown: "Equal"
    }

    let find: any = await Currency.findOne({ name: 'sy', sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')
    if (schema.sell > find.sell) schema['updown'] = 'up'
    else if (schema.sell < find.sell) schema['updown'] = 'down'

    Currency.create(schema)
    return schema
}
export default sp_today