import browserId from 'browser-id'

export function GET_query(query) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let url = '/api/shipgirl/query?' 
        if (query.keyword) url += `keyword=${query.keyword}&`
        if (query.keywordMod) url += `keyword_mod=${query.keywordMod}&`
        if (query.keywordDescription && query.keywordDescription.trim()) url += `keywordDescription=${encodeURIComponent(query.keywordDescription)}&`
        if (query.tagMatchMode && query.tagMatchMode !== 'any') url += `tagMatchMode=${query.tagMatchMode}&`
        if (query.page > 1) url += `page=${query.page}&`
        if (query.constructMod) url += `construct_mod=${query.constructMod}&`
        if (query.altOutfitMod) url += `alt_outfit_mod=${query.altOutfitMod}&`
        if (query.extraContentMod) url += `extra_content_mod=${query.extraContentMod}&`
        if (query.ratingMod) url += `rating_mod=${query.ratingMod}&`
        if (query.selectedFranchise && query.selectedFranchise.length > 0) {
            const franchiseParam = Array.isArray(query.selectedFranchise) 
                ? query.selectedFranchise.join(',') 
                : query.selectedFranchise;
            url += `folder=${franchiseParam}&`;
        }
        if (query.selectedCountry && query.selectedCountry.length > 0) {
            const countryParam = Array.isArray(query.selectedCountry) 
                ? query.selectedCountry.join(',') 
                : query.selectedCountry;
            url += `nation=${countryParam}&`;
        }
        if (query.selectedType && query.selectedType.length > 0) {
            const typeParam = Array.isArray(query.selectedType) 
                ? query.selectedType.join(',') 
                : query.selectedType;
            url += `type=${typeParam}&`;
        }
        if (query.limit) url += `limit=${query.limit}&`
        if (query.strict) url += `strict=${query.strict}&`
        if (query.includeExtrapolate) url += `include_extrapolate=${query.includeExtrapolate}&`
        if (query.keywordIllust) url += `illust=${query.keywordIllust}&`
        if (query.sortBy && query.sortBy.length > 0) url += `sort_by=${query.sortBy.join(',')}&`

        let res = await fetch(url, option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}

export function GET_tag_suggestions(query) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let url = `/api/shipgirl/tag_suggestions?q=${encodeURIComponent(query)}`
        
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

export function GET_articleById(id) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET"
        }
        fetch('/api/shipgirl/article/' + id, option)
            .then(async (res) => {
                if (!res.ok) {
                    reject(await res.text())
                }
                else {
                    resolve(await res.text())
                }
            })
            .catch(e => reject("error when fetch"))
    })
}