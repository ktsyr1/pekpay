import lebanonprices from "res/apis/lebanonprices";
import sp_today from "res/apis/sp-today";

export default async function scrap(currency: string) {
    if (currency === 'lb') return lebanonprices()
    else if (currency === 'sy') return await sp_today()
    // if(currency ==='lb')
}