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
        date: new Date().getTime()
    }

    Currency.create(schema)
    return schema


}
export default sp_today