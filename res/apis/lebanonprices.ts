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
        date: new Date().getTime()
    }
    Currency.create(schema)
    return schema
}
export default lebanonprices