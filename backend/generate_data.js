const fs = require('fs')
const config = require('./shipgirl_list_config.json')
const hashFile = require('hash-files')
const crypto = require('crypto')
const asciiFolder = require('fold-to-ascii')
const { parse } = require('fast-csv');
const path = require('path')

const BASE_PATH = './data/assets/shipgirls'
const TAG_PATH = './data/assets/shipgirls_tag'

Array.prototype.filterIndex = function (cb) {
    let arr = [];
    this.forEach((a, index) => {
        if (cb(a)) arr.push(index)
    })
    return arr
}

function parseTagFile(content) {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0)
    
    let description = []
    let rating = null
    let body_crop = {
        breast: null,
        head: null,
        face: null,
        eyes: null
    }
    
    if (lines.length > 0) {
        // First line: description tags
        description = lines[0].split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
    }
    
    if (lines.length > 1) {
        // Second line: rating
        rating = lines[1]
    }
    
    // Parse body part detection lines (@Breasts, @HeadAndHair, @face, @Eyes)
    const eyeBoundingBoxes = []
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i]
        if (line.startsWith('@')) {
            const parts = line.split(': ')
            if (parts.length === 2) {
                const detector = parts[0].substring(1) // Remove @ symbol
                const bbox = JSON.parse(parts[1]) // Parse bounding box array
                
                if (detector.toLowerCase().includes('breast')) {
                    body_crop.breast = bbox
                } else if (detector.toLowerCase().includes('head')) {
                    body_crop.head = bbox
                } else if (detector.toLowerCase().includes('face')) {
                    body_crop.face = bbox
                } else if (detector.toLowerCase().includes('eyes')) {
                    eyeBoundingBoxes.push(bbox)
                }
            }
        }
    }
    
    // Handle eyes: if 1 eye, use that box; if 2 eyes, create combined box
    if (eyeBoundingBoxes.length === 1) {
        body_crop.eyes = eyeBoundingBoxes[0]
    } else if (eyeBoundingBoxes.length === 2) {
        // Create combined bounding box containing both eyes
        const [box1, box2] = eyeBoundingBoxes
        const minX = Math.min(box1[0], box2[0])
        const minY = Math.min(box1[1], box2[1])
        const maxX = Math.max(box1[2], box2[2])
        const maxY = Math.max(box1[3], box2[3])
        body_crop.eyes = [minX, minY, maxX, maxY]
    }
    
    return { description, rating, body_crop }
}

// function main_shipgirl () {

//     let dirs = fs.readdirSync(BASE_PATH)

//     let list = []

//     dirs.forEach((dir) => {
//         if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt"].includes(dir)) return

//         let list_entry = {
//             name: dir,
//             count: 0,
//             base_count: 0,
//             img: [],
//         }

//         let entry_config = config.find(val => val.name === dir) || {}

//         let base_count = 0
//         let count = 0

//         let files = fs.readdirSync(BASE_PATH + '/' + dir)
//         files.forEach((file, index) => {
//             if (!(file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp'))) return
//             let comp = file.slice(0, file.lastIndexOf('.')).split('_')
//             let char_name = comp[0]

//             const isBase = (!comp[1] || (comp[1].toLowerCase() === entry_config.baseArtSuffix && !comp[2]))
            
//             count += 1
//             if (isBase) base_count += 1

//             console.log(`(${dir} - ${index + 1}/${files.length}) Adding ${file}`)
//             let file_hash = hashFile.sync({
//                 files: [BASE_PATH + '/' + dir + '/' + file]
//             })

//             list_entry.img.push({
//                 char: char_name,
//                 filename: BASE_PATH + '/' + dir + '/' + file,
//                 is_base: isBase,
//                 file_hash: file_hash,
                
//             })
//         })

//         list_entry.count = count
//         list_entry.base_count = base_count

//         list.push(list_entry)
//     })

//     fs.writeFileSync('data/shipgirl_list.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
// }

function main_shipgirl_db() {

    let dirs = fs.readdirSync(BASE_PATH)

    let list = []
    let tag_frequency = {} // Track tag frequency across all files

    let whitelist_dir = []

    let global_config = config.find(val => val.name === "*") || {}

    dirs.forEach((dir) => {
        if ([".git", ".gitignore", "Current source.txt", "KansenIndex-datamine", "KansenIndex-web", "Franchise logo", "Additional Note.txt", "desktop.ini", ".megaignore", "shipgirl_list_db_new.json"].includes(dir)) return
        if (whitelist_dir.length > 0 && !whitelist_dir.includes(dir)) return

        let series_list = []
        let entry_config = config.find(val => val.name === dir) || {}
        let alias_config = [...global_config.alias]
        let l2d_config = []
        let chibi_config = []
        let spine_config = []
        let voice_config = []
        let m3d_config = []
        let extra_config = []
        let illust_config = []
        let bg_original = []
        if (entry_config.alias) alias_config = [...alias_config, ...entry_config.alias]
        if (entry_config.live2dmapping) {
            l2d_config = JSON.parse(fs.readFileSync(entry_config.live2dmapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.chibispinemapping) {
            chibi_config = JSON.parse(fs.readFileSync(entry_config.chibispinemapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.fullspinemapping) {
            spine_config = JSON.parse(fs.readFileSync(entry_config.fullspinemapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.voicemapping) {
            voice_config = JSON.parse(fs.readFileSync(entry_config.voicemapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.m3dmapping) {
            m3d_config = JSON.parse(fs.readFileSync(entry_config.m3dmapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.extramapping) {
            extra_config = JSON.parse(fs.readFileSync(entry_config.extramapping, {encoding: 'utf-8'}) || "[]")
        }
        if (entry_config.illustmapping) {
            illust_config = JSON.parse(fs.readFileSync(entry_config.illustmapping, {encoding: 'utf-8'}) || "[]")
        }
        if (fs.existsSync(BASE_PATH + '/' + dir + '/bg')) {
            bg_original = fs.readdirSync(BASE_PATH + '/' + dir + '/bg')
        } 

        let base_count = 0
        let count = 0

        illust_config = illust_config.map(val => {
            // for char name, strip all cluster inside parentheses
            let char = val.canon_name.replace(/\(.*\)/g, '').trim()
            // for modifer, for each cluster inside parentheses, split them into an element in the array
            let modifier = val.canon_name.match(/\(.*\)/g)?.map(v => v.replace(/[\(\)]/g, '').trim()) ?? []
            // special case for Azur Lane, if muse or meta is in modifier, remove it from array and append it to char
            if (dir === "Azur Lane" && modifier.includes("muse")) {
                char += " μ"
                modifier = modifier.filter(v => v !== "muse")
            }
            // special case for Azur Lane, if meta is in modifier, remove it from array and append it to char
            if (dir === "Azur Lane" && modifier.includes("meta")) {
                char += " meta"
                modifier = modifier.filter(v => v !== "meta")
            }
            // special case for kancolle if "kai" or "kai ni" in char, remove it from char and append it to modifier
            if (dir === "Kantai Collection" && char.includes("kai ni")) {
                modifier.push("kai ni")
                char = char.replace("kai ni", "").trim()
            }
            else if (dir === "Kantai Collection" && char.includes("kai")) {
                modifier.push("kai")
                char = char.replace("kai", "").trim()
            }
            
            // console.log(`Illust config: |${val.canon_name}| char: |${char}| modifier: |${modifier}|`)
            return {
                ...val,
                char: char,
                modifier: modifier,
            }
        })

        //console.log(chibi_config)

        let files = fs.readdirSync(BASE_PATH + '/' + dir)
        files.forEach((file, index) => {
            // DEBUG: stop at 100
            // if (count >= 100) return

            if (!(file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.webp'))) return
            let comp = file.slice(0, file.lastIndexOf('.')).split('_')
            let char_name = comp[0]
            let modifiers = comp[1] ? comp.slice(1) : []
            //console.log(modifiers)

            //special case for kc cuz im an idiot
            if (dir === "Kantai Collection") comp = [comp[0], ...(comp[1].split(" "))]

            const isBase = (!comp[1] || (comp[1].toLowerCase() === entry_config.baseArtSuffix && !comp[2]))
            const isDamage = (comp[1] && entry_config.damageArtSuffix && comp.slice(1).findIndex(val => val.toLowerCase() === entry_config.damageArtSuffix) !== -1) || false
            const isOath = (comp[1] && entry_config.oathArtSuffix && comp.slice(1).findIndex(val => val.toLowerCase() === entry_config.oathArtSuffix) !== -1) || false
            const isRetrofit = (comp[1] && entry_config.retrofitArtSuffix && comp.slice(1).findIndex(val => val.toLowerCase() === entry_config.retrofitArtSuffix) !== -1) || false
            const includeBg = (comp[1] && entry_config.backgroundSuffix && comp.slice(1).findIndex(val => val.toLowerCase() === entry_config.backgroundSuffix) !== -1) || false
            const isCensored = (comp[1] && entry_config.censoredSuffix && comp.slice(1).findIndex(val => val.toLowerCase() === entry_config.censoredSuffix) !== -1) || false
            // isOutfit is true if isBase is false and after remove all comp that match baseArtSuffix, damageArtSuffix, oathArtSuffix, retrofitArtSuffix, backgroundSuffix, censoredSuffix, the length of comp is not 0
            const isOutfit = !isBase && comp.slice(1).filter(val => ![entry_config.baseArtSuffix, entry_config.damageArtSuffix, entry_config.oathArtSuffix, entry_config.retrofitArtSuffix, entry_config.backgroundSuffix, entry_config.censoredSuffix].includes(val.toLowerCase())).length !== 0
            
            count += 1
            if (isBase) base_count += 1

            console.log(`(${dir} - ${index + 1}/${files.length}) Adding ${file}`)
            let file_hash = hashFile.sync({
                files: [BASE_PATH + '/' + dir + '/' + file]
            })
            
            // Get file modified date
            const file_stats = fs.statSync(BASE_PATH + '/' + dir + '/' + file)
            const file_modified_date = file_stats.mtime
            const file_size = file_stats.size

            const alias = alias_config.filter(val => val.originalName.toLowerCase() === char_name.toLowerCase()).flatMap(f => f.value)
            const l2d = l2d_config.find(val => file.toLowerCase().includes(val.name.toLowerCase())) || null
            const chibi_candidate = chibi_config.filter(val => 
                dir === "Battleship Bishoujo Puzzle" ?
                    file.toLowerCase().replace(/\s+/g, '').includes(val.name.toLowerCase()) :
                dir === "Warship Girls R" ?
                    file.toLowerCase().replace('_damage', '').includes(val.name.toLowerCase()) :
                    file.toLowerCase().includes(val.name.toLowerCase())
            ) || []
            // pick the one with the longest name
            const chibi = chibi_candidate.reduce((prev, curr) => {
                if ((prev?.name.length || 0) > curr.name.length) return prev
                return curr
            }, null)
            const spine_candidate = spine_config.filter(val =>
                dir === "Battleship Bishoujo Puzzle" ?
                    file.toLowerCase().replace(/\s+/g, '').includes(val.name.toLowerCase()) :
                    file.toLowerCase().includes(val.name.toLowerCase())
            ) || []
            // pick the one with the longest name
            const spine = spine_candidate.reduce((prev, curr) => {
                if ((prev?.name.length || 0) > curr.name.length) return prev
                return curr
            }, null)
            const voice_candidate = voice_config.filter(val =>
                dir === "Battleship Bishoujo Puzzle" || dir === "Blue Oath" ?
                    file.toLowerCase().replace(/\s+/g, '').includes(val.name.toLowerCase()) :
                dir === "Azur Lane" ?
                    (file.toLowerCase().includes(val.name.toLowerCase()) || file.toLowerCase().replace(' ', ' ').includes(val.name.toLowerCase())) :
                dir === "Kantai Collection" ?
                    char_name.toLowerCase() === val.name.toLowerCase() :
                    file.toLowerCase().includes(val.name.toLowerCase()) 
            ) || null
            const voice = voice_candidate.reduce((prev, curr) => {
                if ((prev?.name.length || 0) > curr.name.length) return prev
                return curr
            }, null)
            const extra_candidate = extra_config.filter(val =>
                dir === "Azur Lane" ?
                    (file.toLowerCase().includes(val.name.toLowerCase()) || file.toLowerCase().replace(' ', ' ').includes(val.name.toLowerCase())) :
                    file.toLowerCase().includes(val.name.toLowerCase()) 
            ) || null
            const extra_info = extra_candidate.reduce((prev, curr) => {
                if ((prev?.name.length || 0) > curr.name.length) return prev
                return curr
            }, null)
            const m3d_candidate = m3d_config.filter(val =>
                file.toLowerCase().includes(val.name.toLowerCase())
            ) || null
            const m3d = m3d_candidate.reduce((prev, curr) => {
                if ((prev?.name.length || 0) > curr.name.length) return prev
                return curr
            }, null)

            const folded_name = asciiFolder.foldMaintaining(char_name)
            if (folded_name !== char_name) alias.push(folded_name)

            // fold all name in current alias list
            alias.forEach((val) => {
                const folded_val = asciiFolder.foldMaintaining(val)
                if (folded_val !== val) alias.push(folded_val)
            })

            // copy data voice to temp variable (not reference)
            let temp_voice = null
            if (voice) {
                temp_voice = {...voice}
            }

            const illust_candidate = illust_config.filter(val =>
                dir === "Azur Lane" ?
                    (char_name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().startsWith(val.char.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()) || alias.some(a => a.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().startsWith(val.char.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()))) :
                    folded_name.toLowerCase().startsWith(val.char.toLowerCase()) || alias.some(a => a.toLowerCase().startsWith(val.char.toLowerCase()))
            ) || null
            // console.log(illust_candidate)

            let illust = illust_candidate?.reduce((prev, curr) => {
                // take candidate with longest length of char then with the least number of modifier
                if ((prev?.char.length || 0) > curr.char.length) return prev
                if ((prev?.char.length || 0) < curr.char.length) return curr
                if ((prev?.modifier.length || 0) < curr.modifier.length) return prev
                return curr
            }, illust_candidate[0]) || null

            if (illust) {
                illust_candidate.reduce((prev, curr) => {
                    // console.log(curr.modifier.map(m => m.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()))
                    // console.log(modifiers.map(m => m.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()))
                    // for each candidate, count how many match of its modifier against current file modifier (strip all special character and space and lower case before comparison), higher match count take precedence
                    const curr_match = curr.modifier.filter(v => modifiers.map(m => m.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).some(s => s.includes(v.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()))).length
                    if (curr_match > prev) {
                        illust = curr
                        prev = curr_match
                    }
                    return prev
                }, 0)
            }

            // for each file check the "bg" subfolder in its parent folder for the same file name (without extension) and if it exists, set nonAI_processed to the path of the bg file, else null
            let non_ai_original = null
            if (bg_original.length > 0) {
                const bg_file = bg_original.find(v => v.slice(0, v.lastIndexOf('.')).toLowerCase() === file.slice(0, file.lastIndexOf('.')).toLowerCase())
                if (bg_file) {
                    non_ai_original = BASE_PATH + '/' + dir + '/bg/' + bg_file
                }
            }

            // Read description tags and additional info from corresponding txt file
            let description = []
            let rating = null
            let body_crop = null
            const tag_file_path = path.join(TAG_PATH, dir, file.slice(0, file.lastIndexOf('.')) + '.txt')
            if (fs.existsSync(tag_file_path)) {
                try {
                    const tag_content = fs.readFileSync(tag_file_path, {encoding: 'utf-8'}).trim()
                    if (tag_content) {
                        const parsed_info = parseTagFile(tag_content)
                        description = parsed_info.description
                        rating = parsed_info.rating
                        body_crop = parsed_info.body_crop
                        
                        // Update tag frequency
                        description.forEach(tag => {
                            tag_frequency[tag] = (tag_frequency[tag] || 0) + 1
                        })
                    }
                } catch (error) {
                    console.log(`Error reading tag file for ${file}: ${error.message}`)
                }
            } else {
                console.log(`Tag file not found for: ${file}`)
            }


            series_list.push({
                char: char_name,
                modifier: modifiers.join(' ').trim(),
                full_dir: BASE_PATH + '/' + dir + '/' + file,
                filename: file,
                is_base: isBase,
                is_damage: isDamage,
                is_oath: isOath,
                is_retrofit: isRetrofit,
                include_bg: includeBg,
                non_ai_processed: non_ai_original,
                is_censored: isCensored,
                is_outfit: isOutfit,
                file_hash: file_hash,
                file_modified_date: file_modified_date,
                file_size: file_size,
                folder: dir,
                alias: alias.concat(extra_config?.alias || []),
                description: description,
                rating: rating,
                body_crop: body_crop,
                l2d: l2d,
                chibi: chibi,
                spine: spine,
                voice: temp_voice,
                // TODO: consolidate both AL data and WSG data
                voice_actor: temp_voice?.voice_actor ? [temp_voice?.voice_actor] : (extra_info?.voice_actor ?? []).length > 0 ? extra_info.voice_actor : null,
                m3d: m3d,
                nation: extra_info?.nation,
                ship_type: extra_info?.ship_type,
                // TODO: pending illustrator info from extra_config
                illust: illust?.illustrator,
                danbooru_banned: illust?.danbooru_banned ?? false,
                birthday: extra_info?.birthday,
                height: extra_info?.height,
                displacement: extra_info?.displacement,
            })
        })

        // extrapolate for illust config
        // filter entries with illust config
        let entries_with_illust = series_list.filter(v => v.illust)
        // for the remaining entries, find the one with the same char name and is_base = true and set the illust to the same illust and danbooru_banned with "? " prefix to illust to flag it as extrapolated
        series_list.forEach((val, index) => {
            if (val.illust) return
            const found = entries_with_illust.find(v => v.char.toLowerCase() === val.char.toLowerCase() && v.is_base === true)
            if (found) {
                series_list[index].illust = "? " + found.illust
                series_list[index].danbooru_banned = found.danbooru_banned
            }
        })
        
        // orphaned extra config check
        if (whitelist_dir.length > 0) {
            if (l2d_config.length > 0) {
                l2d_config.forEach((val) => {
                    if (list.findIndex(v => v.l2d && v.l2d.name === val.name) === -1) {
                        console.log(`Orphaned live2d config found: |${val.name}|`)
                    }
                })
            }
            if (chibi_config.length > 0) {
                chibi_config.forEach((val) => {
                    if (list.findIndex(v => v.chibi && v.chibi.name === val.name) === -1) {
                        console.log(`Orphaned chibi config found: |${val.name}|`)
                    }
                })
            }
            if (spine_config.length > 0) {
                spine_config.forEach((val) => {
                    if (list.findIndex(v => v.spine && v.spine.name === val.name) === -1) {
                        console.log(`Orphaned spine config found: |${val.name}|`)
                    }
                })
            }
            if (voice_config.length > 0) {
                voice_config.forEach((val) => {
                    if (list.findIndex(v => v.voice && v.voice.name === val.name) === -1) {
                        console.log(`Orphaned voice config found: |${val.name}|`)
                    }
                })
            }
            if (m3d_config.length > 0) {
                m3d_config.forEach((val) => {
                    if (list.findIndex(v => v.m3d && v.m3d.name === val.name) === -1) {
                        console.log(`Orphaned m3d config found: |${val.name}|`)
                    }
                })
            }
            // if (illust_config.length > 0) {
            //     illust_config.forEach((val) => {
            //         if (list.findIndex(v => v.illust && v.illust.name === val.name) === -1) {
            //             console.log(`Orphaned illust config found: |${val.name}|`)
            //         }
            //     })
            // }
        }

        list = list.concat(series_list)
    })

    // Generate tag frequency report
    console.log('Generating tag frequency report...')
    const sorted_tags = Object.entries(tag_frequency)
        .sort((a, b) => b[1] - a[1]) // Sort by frequency descending
        .map(([tag, count]) => `${tag}: ${count}`)
    
    const total_tags = Object.keys(tag_frequency).length
    const total_occurrences = Object.values(tag_frequency).reduce((sum, count) => sum + count, 0)
    
    const report_content = [
        `Tag Frequency Report`,
        `Generated: ${new Date().toISOString()}`,
        `Total unique tags: ${total_tags}`,
        `Total tag occurrences: ${total_occurrences}`,
        `Average tags per image: ${(total_occurrences / list.length).toFixed(2)}`,
        ``,
        `Tags by frequency:`,
        ...sorted_tags
    ].join('\n')
    
    fs.writeFileSync('data/tag_frequency_report.txt', report_content, {encoding: 'utf-8'})
    console.log(`Tag frequency report saved to data/tag_frequency_report.txt`)

    fs.writeFileSync('data/shipgirl_list_db_new.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
}

function main_franchise() {
    let dirs = fs.readdirSync(BASE_PATH)

    let list = []

    dirs.forEach((dir) => {
        if ([".git", ".gitignore", "Current source.txt", "KanssenIndex-datamine", "KanssenIndex-web", "Franchise logo", "Additional Note.txt", ".megaignore"].includes(dir)) return

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

function extrapolate_data() {
    let list = JSON.parse(fs.readFileSync('data/shipgirl_list_db_new.json', {encoding: 'utf-8'}))

    // special case for data from extra config (nation, ship_type)
    // search for any shipgirl that has the same char name and set the nation and ship_type
    console.log('Extrapolating nation and ship_type from Azur Lane base form')
    const al_list = list.filter(v => v.folder === "Azur Lane")
    list.forEach((val, index) => {
        if (val.nation && val.ship_type) return

        const found = al_list.find(v => (v.char.toLowerCase() === val.char.toLowerCase() || v.alias.some(a => a.toLowerCase() === val.char.toLowerCase())) && v.is_base === true)
        if (found) {
            list[index].nation = list[index].nation ?? (found.nation?.map(v => "? " + v))
            list[index].ship_type = list[index].ship_type ?? (found.ship_type ? "? " + found.ship_type : null)
        }
    })

    console.log('Extrapolating data from Warship Girls R')
    const wgr_list = list.filter(v => v.folder === "Warship Girls R")
    list.forEach((val, index) => {
        if (val.nation && val.birthday && val.height && val.displacement) return

        const found = wgr_list.find(v => (v.char.toLowerCase() === val.char.toLowerCase() || v.alias.some(a => a.toLowerCase() === val.char.toLowerCase())) && v.is_base === true)
        if (found) {
            list[index].nation = list[index].nation ?? (found.nation?.map(v => "? " + v))
            list[index].birthday = found.birthday ? "? " + found.birthday : null
            list[index].height = found.height ? "? " +  found.height : null
            list[index].displacement = found.height ? "? " + found.displacement : null
        }
    })

    console.log('Extrapolating data from Kantai Collection')
    const kc_list = list.filter(v => v.folder === "Kantai Collection")
    list.forEach((val, index) => {
        if (val.ship_type) return

        const found = kc_list.find(v => (v.char.toLowerCase() === val.char.toLowerCase() || v.alias.some(a => a.toLowerCase() === val.char.toLowerCase())) && v.is_base === true)
        if (found) {
            list[index].ship_type = list[index].ship_type ?? (found.ship_type ? "? " + found.ship_type : null)
            list[index].nation = list[index].nation ?? (found.nation?.map(v => "? " + v))
        }
    })

    fs.writeFileSync('data/shipgirl_list_db_new.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
}

function override_data() {
    return new Promise((resolve, reject) => {
        const csv_data = []
        console.log('Overriding data from data_override.csv')

        const stream = parse({ headers: true })
            .on('error', error => console.error(error))
            .on('data', row => {
                csv_data.push(row)
            })
            .on('end', rowCount => {
                console.log(`Parsed ${rowCount} rows`)
                let list = JSON.parse(fs.readFileSync('data/shipgirl_list_db_new.json', {encoding: 'utf-8'}))

                // for each row in csv
                csv_data.forEach((row) => {
                    // find the corresponding shipgirl in list
                    let foundIdx = list.filterIndex(v => v.char.toLowerCase() === row.char.toLowerCase() && v.folder.toLowerCase() === row.folder.toLowerCase() && (row.modifier ? v.modifier.toLowerCase() === row.modifier.toLowerCase() : true))
                    if (!foundIdx || foundIdx.length === 0) {
                        console.log(`Not found: ${row.char} - ${row.folder} ${row.modifier ? "- " + row.modifier : ""}`)
                        return
                    }

                    // for each found shipgirl, update the data
                    foundIdx.forEach((i) => {
                        list[i] = {
                            ...list[i],
                            alias: list[i].alias.concat(row.alias_add ? row.alias_add.split(',').map(v => v.trim()) : []),
                            nation: row.nation ? row.nation.split(',').map(v => v.trim()) : list[i].nation,
                            ship_type: row.ship_type ? row.ship_type : list[i].ship_type,
                            voice_actor: row.voice_actor ? row.voice_actor.split(',').map(v => v.trim()) : list[i].voice_actor,
                            illust: row.illust ? row.illust : list[i].illust,
                        }
                    })
                })

                // overwrite the shipgirl_list_db_new.json
                fs.writeFileSync('data/shipgirl_list_db_new.json', JSON.stringify(list, {}, '  '), {encoding: 'utf-8'})
                resolve()
            });

        fs.createReadStream('data/data_override.csv').pipe(stream)
    })
}


async function main(full_gen = true, override = true, extrapolate = true) {
    if (full_gen) main_shipgirl_db()
    if (override) await override_data()
    if (extrapolate) extrapolate_data()
    //main_franchise()
}

// parse args
let full_gen = true
let override = true
let extrapolate = true

if (process.argv.length > 2) {
    // can use any option in any order
    if (process.argv.includes('--no-full-gen')) full_gen = false
    if (process.argv.includes('--no-override')) override = false
    if (process.argv.includes('--no-extrapolate')) extrapolate = false
}

main(full_gen, override, extrapolate)