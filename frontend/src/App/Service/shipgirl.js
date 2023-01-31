import browserId from 'browser-id'

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

export function POST_submission(data) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "POST",
            body: data
        }
        fetch('/api/shipgirl/submission', option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.json())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}

export function POST_getFav(char, folder) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "POST",
            body: JSON.stringify({
                char: char,
                folder: folder,
                fav: browserId()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch('/api/shipgirl/get_fav', option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.json())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}

export function POST_toggleFav(char, folder) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "POST",
            body: JSON.stringify({
                char: char,
                folder: folder,
                fav: browserId()
            }),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }
        fetch('/api/shipgirl/toggle_fav', option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.json())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}

export function GET_getTopFav() {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET"
        }
        fetch('/api/shipgirl/bote_fav_lb', option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.json())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}

export function GET_cgById(id) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET"
        }
        fetch('/api/shipgirl/cg/' + id, option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.json())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}