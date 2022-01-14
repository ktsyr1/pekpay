import sp_today from 'res/apis/sp-today'

export default async function scrap() {
    try {
        let data = await sp_today()
        // console.log(data);

        return data
    } finally {

    }
}