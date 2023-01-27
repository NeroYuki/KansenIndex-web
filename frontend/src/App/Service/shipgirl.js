export function GET_query(query) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let url = '/api/shipgirl/query?' 
        if (query.keyword) url += `keyword=${query.keyword}&`
        if (query.keywordMod) url += `keyword_mod=${query.keywordMod}&`
        if (query.page > 1) url += `page=${query.page}&`
        if (query.constructMod) url += `construct_mod=${query.constructMod}&`
        if (query.altOutfitMod) url += `alt_outfit_mod=${query.altOutfitMod}&`
        if (query.selectedFranchise) url += `folder=${query.selectedFranchise}&`
        if (query.limit) url += `limit=${query.limit}&`

        let res = await fetch(url, option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}

export function GET_random(query) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let url = '/api/shipgirl/random' 
        let res = await fetch(url, option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}