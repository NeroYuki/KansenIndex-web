export function GET_list_all() {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let res = await fetch('/api/game/list_all', option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}

export function GET_info(id) {
    return new Promise(async (resolve, reject) => {
        let option = {
            method: "GET",
        }
        let res = await fetch('/api/game/info/' + id, option).catch(e => reject("error when fetch"))

        if (!res) {
            reject('invalid response')
        }
        else {
            resolve(await res.json())
        }
    })
}