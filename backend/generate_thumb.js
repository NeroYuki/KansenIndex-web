const sharp = require('sharp');
const fs = require('fs')
const config = require('./shipgirl_list_config.json')
const hashFile = require('hash-files')
const crypto = require('crypto')

const BASE_PATH = './data/assets/shipgirls'

function thumb_gen () {

    let dirs = fs.readdirSync(BASE_PATH)

    dirs.forEach((dir) => {
        if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt"].includes(dir)) return

        let files = fs.readdirSync(BASE_PATH + '/' + dir)
        files.forEach(async (file, index) => {
            if (!(file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp'))) return

            if (!fs.existsSync('./data/thumbs/shipgirls/' + dir)) {
                fs.mkdirSync('./data/thumbs/shipgirls/' + dir, {recursive: true})
            }

            console.log(`(${dir} - ${index + 1}/${files.length}) Adding ${file}`)

            let target_dir = './data/thumbs/shipgirls/' + dir + '/' + file.slice(0, file.lastIndexOf('.')) + '.png'
            console.log("target:", target_dir)
            img = await sharp(BASE_PATH + '/' + dir + '/' + file)
				.resize({height: 512})
				.png()
                .toFile(target_dir)

        })
    })

    console.log('done')
}

thumb_gen()