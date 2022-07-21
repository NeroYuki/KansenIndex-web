export function GET_query(query) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let url = '/api/shipgirl/query?' 
        if (query.keyword) url += `keyword=${query.keyword}&`
        if (query.page > 0) url += `page=${query.page}&`

        let res = await fetch(url, option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}