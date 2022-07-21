const fs = require('fs')
const config = require('./shipgirl_list_config.json')
const hashFile = require('hash-files')
const crypto = require('crypto')

const BASE_PATH = './data/assets/shipgirls'

function main_shipgirl () {

    let dirs = fs.readdirSync(BASE_PATH)

    let list = []

    dirs.forEach((dir) => {
        if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt"].includes(dir)) return

        let list_entry = {
            name: dir,
            count: 0,
            base_count: 0,
            img: [],
        }

        let entry_config = config.find(val => val.name === dir) || {}

        let base_count = 0
        let count = 0

        let files = fs.readdirSync(BASE_PATH + '/' + dir)
        files.forEach((file, index) => {
            if (!(file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp'))) return
            let comp = file.slice(0, file.lastIndexOf('.')).split('_')
            let char_name = comp[0]

            const isBase = (!comp[1] || (comp[1].toLowerCase() === entry_config.baseArtSuffix && !comp[2]))
            
            count += 1
            if (isBase) base_count += 1

            console.log(`(${dir} - ${index + 1}/${files.length}) Adding ${file}`)
            let file_hash = hashFile.sync({
                files: [BASE_PATH + '/' + dir + '/' + file]
            })

            list_entry.img.push({
                char: char_name,
                filename: BASE_PATH + '/' + dir + '/' + file,
                is_base: isBase,
                file_hash: file_hash
            })
        })

        list_entry.count = count
        list_entry.base_count = base_count

        list.push(list_entry)
    })

    fs.writeFileSync('data/shipgirl_list.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
}

function main_franchise() {
    let dirs = fs.readdirSync(BASE_PATH)

    let list = []

    dirs.forEach((dir) => {
        if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt"].includes(dir)) return

        let id = crypto.createHash('sha256').update(dir, 'utf8').digest().toString('hex')
        let list_entry = {
            id: id,
            name: dir,
            display_name: dir,
            desc: "",
            icon_image: "",
            general_info: [],
            release_date: [],
            extra_info: "",
            screenshot: [],
        }

        list.push(list_entry)
    })

    fs.writeFileSync('data/franchise_list_new.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
}

main_franchise()