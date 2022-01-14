import lebanonprices from "res/apis/lebanonprices";

export default async function scrap() {
    try {
        return await lebanonprices()
    } finally {

    }
}