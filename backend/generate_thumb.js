const sharp = require('sharp');
const fs = require('fs')
const config = require('./shipgirl_list_config.json')
const hashFile = require('hash-files')
const crypto = require('crypto')

const BASE_PATH = './data/assets/shipgirls'

async function thumb_gen (add_mode = false) {

    let dirs = fs.readdirSync(BASE_PATH)
    let whitelist_dir = []

    for (let dir of dirs) {
        if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt", "desktop.ini", "Rubbish"].includes(dir)) continue
        if (whitelist_dir.length > 0 && !whitelist_dir.includes(dir)) continue

        let files = fs.readdirSync(BASE_PATH + '/' + dir)
        for (let [index, file] of files.entries()) {
            if (!(file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp'))) continue

            if (!fs.existsSync('./data/thumbs/shipgirls/' + dir)) {
                fs.mkdirSync('./data/thumbs/shipgirls/' + dir, {recursive: true})
            }

            console.log(`(${dir} - ${index + 1}/${files.length}) Adding ${file}`)

            let target_dir = './data/thumbs/shipgirls/' + dir + '/' + file.slice(0, file.lastIndexOf('.')) + '.png'
            console.log("target:", target_dir)

            if(add_mode && fs.existsSync(target_dir)) {
                console.log('skipped')
                continue
            }
            await sharp(BASE_PATH + '/' + dir + '/' + file)
				.resize({height: 512})
				.png()
                .toFile(target_dir)
                .catch(err => {})
        }
    }

    console.log('done')
}

thumb_gen(true)
