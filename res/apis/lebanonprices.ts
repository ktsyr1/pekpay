import axios from "axios";
import { Currency } from 'res/mongoDB';
async function lebanonprices() {
    let URL: string = "https://lebanonprices.herokuapp.com/"
    let { data } = await axios.get(URL)
    let schema = {
        update: Number(data.time),
        name: 'lb',
        sell: data.dol_sell,
        buy: data.dol_buy,
        date: new Date().getTime(),
        updown: "Equal"
    }
    let find: any = await Currency.findOne({ name: 'lb', sell: { $ne: schema.sell } })
        .sort({ _id: -1 })
        .select('sell')
    if (schema.sell > find.sell) schema['updown'] = 'up'
    else if (schema.sell < find.sell) schema['updown'] = 'down'
    // , "down"] },
    console.log(schema);

    Currency.create(schema)
    return schema
}
export default lebanonprices