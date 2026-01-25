const express = require('express')
const router = express.Router()
const db = require('../database/database_interaction')
const multer  = require('multer')
const fs = require('fs')
const path = require('path')
const { ObjectId } = require('mongodb')

// Tag list storage
let tagList = []

// Load tag list from file
function loadTagList() {
    try {
        const tagFilePath = path.join(__dirname, '../data/tag_frequency_report.txt')
        const content = fs.readFileSync(tagFilePath, 'utf8')
        const lines = content.split('\n')
        
        tagList = []
        let inTagSection = false
        
        for (const line of lines) {
            if (line.includes('Tags by frequency:')) {
                inTagSection = true
                continue
            }
            
            if (inTagSection && line.includes(':')) {
                const [tagName, frequency] = line.split(': ')
                if (tagName && frequency && !isNaN(parseInt(frequency))) {
                    tagList.push({
                        tag: tagName.trim(),
                        frequency: parseInt(frequency)
                    })
                }
            }
        }
        
        console.log(`Loaded ${tagList.length} tags from frequency report`)
    } catch (error) {
        console.error('Error loading tag list:', error)
        tagList = []
    }
}

// Load tags on startup
loadTagList()

// Reload tags every 30 minutes
setInterval(loadTagList, 30 * 60 * 1000)

const jsonParser = express.json()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploaded_image/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E6)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

function fileFilter (req, file, cb) {
    // only allow image file to go through
    if (file.mimetype.startsWith('image/')) {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({ storage: storage, limits: {fileSize: 20 * 1000 * 1000 * 1000}, fileFilter: fileFilter })

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Tag suggestion endpoint
router.get('/tag_suggestions', (req, res) => {
    const query = req.query.q || ''
    
    if (!query.trim()) {
        return res.json([])
    }
    
    const filteredTags = tagList
        .filter(item => item.tag.toLowerCase().includes(query.toLowerCase()))
        .sort((a, b) => b.frequency - a.frequency) // Sort by frequency descending
        .slice(0, 5) // Limit to 5 results
    
    res.json(filteredTags)
})

router.get('/query', async (req, res) => {
    let query = req.query

    let db_query = {
        $and: []
    }
    let skip = 0
    const ENTRY_PER_PAGE = Math.max(query.limit ? Math.min(parseInt(query.limit), 100) : 20, 10)
    let include_extrapolated = query.include_extrapolate ?? true

    // console.log(query)

    if (query.keyword) {
        db_query.$and.push({
            $or: [
                {filename: {$regex: escapeRegExp(query.keyword), $options: 'i'}},
                {alias: {$regex: escapeRegExp(query.keyword), $options: 'i'}}
            ]
        })
        if (query.keyword_mod) {
            let val = parseInt(query.keyword_mod) || 0
            if ((val >> 0) & 1) {   //char name only
                db_query.$and[0].$or = [
                    {char: {$regex: (query.strict ? "^" : "") + escapeRegExp(query.keyword) + (query.strict ? "$" : ""), $options: 'i'}},
                    {alias: {$regex: (query.strict ? "^" : "") + escapeRegExp(query.keyword) + (query.strict ? "$" : ""), $options: 'i'}}
                ]
            }
            if ((val >> 1) & 1) {   //modifier name only
                db_query.$and[0].$or.push(filename = {$regex: "_.*" + escapeRegExp(query.keyword), $options: 'i'})
            }
            if ((val >> 2) & 1) {   //description tags
                db_query.$and[0].$or.push({description: {$regex: escapeRegExp(query.keyword), $options: 'i'}})
            }
        }
    }
    if (query.keywordDescription) {
        // Search specifically in description tags array with more precise matching
        const keywords = query.keywordDescription.split(',').map(k => k.trim()).filter(k => k.length > 0)
        if (keywords.length > 0) {
            // Use tagMatchMode to control how multiple tags are matched
            if (query.tagMatchMode === 'all') {
                // ALL mode: all keywords must be present (exact tag matching)
                const tagQuery = {
                    $and: keywords.map(keyword => ({
                        description: {$elemMatch: {$regex: "^" + escapeRegExp(keyword) + "$", $options: 'i'}}
                    }))
                }
                db_query.$and.push(tagQuery)
            } else {
                // ANY mode (default): any keyword can match (exact tag matching)
                const tagQuery = {
                    $or: keywords.map(keyword => ({
                        description: {$elemMatch: {$regex: "^" + escapeRegExp(keyword) + "$", $options: 'i'}}
                    }))
                }
                db_query.$and.push(tagQuery)
            }
        }
    }
    if (query.folder) {
        // Handle multiple folders as OR condition
        const folders = query.folder.split(',').map(f => f.trim());
        if (folders.length > 1) {
            db_query.$and.push({
                $or: folders.map(folder => ({folder: folder}))
            });
        } else {
            db_query.folder = query.folder;
        }
    }
    if (query.illust) {
        db_query.$and.push({
            $or: [
                {illust: {$regex: (query.strict ? "^" : "") + escapeRegExp(query.illust) + (query.strict ? "$" : ""), $options: 'i'}},
                {illust: {$regex: (query.strict ? "^\\? " : "\\? ") + escapeRegExp(query.illust) + (query.strict ? "$" : ""), $options: 'i'}}
            ]
        })
        if (!include_extrapolated) 
            db_query.$and[db_query.$and.length - 1].$or.pop()
    }
    if (query.nation) {
        // Handle multiple nations as OR condition
        const nations = query.nation.split(',').map(n => n.trim());
        
        if (nations.includes("Unknown")) {
            // If "Unknown" is one of the selections, include null values
            const nonUnknownNations = nations.filter(n => n !== "Unknown");
            let orConditions = [{nation: null}];
            
            if (nonUnknownNations.length > 0) {
                // Add conditions for each non-unknown nation
                nonUnknownNations.forEach(nation => {
                    orConditions.push({nation: nation});
                    if (include_extrapolated) {
                        orConditions.push({nation: "? " + nation});
                    }
                });
            }
            
            db_query.$and.push({ $or: orConditions });
        }
        else if (nations.length > 1) {
            // Multiple known nations
            let orConditions = [];
            nations.forEach(nation => {
                orConditions.push({nation: nation});
                if (include_extrapolated) {
                    orConditions.push({nation: "? " + nation});
                }
            });
            db_query.$and.push({ $or: orConditions });
        }
        else {
            // Single nation (backward compatibility)
            const nation = nations[0];
            if (nation === "Unknown") {
                db_query.nation = null;
            }
            else {
                db_query.$and.push({
                    $or: [
                        {nation: nation},
                        {nation: "? " + nation}
                    ]
                });
                if (!include_extrapolated) 
                    db_query.$and[db_query.$and.length - 1].$or.pop();
            }
        }
    }
    if (query.type) {
        // Handle multiple ship types as OR condition
        const types = query.type.split(',').map(t => t.trim());
        
        if (types.includes("Unknown")) {
            // If "Unknown" is one of the selections, include null values
            const nonUnknownTypes = types.filter(t => t !== "Unknown");
            let orConditions = [{ship_type: null}];
            
            if (nonUnknownTypes.length > 0) {
                // Add conditions for each non-unknown type
                nonUnknownTypes.forEach(type => {
                    orConditions.push({ship_type: type});
                    if (include_extrapolated) {
                        orConditions.push({ship_type: "? " + type});
                    }
                });
            }
            
            db_query.$and.push({ $or: orConditions });
        }
        else if (types.length > 1) {
            // Multiple known types
            let orConditions = [];
            types.forEach(type => {
                orConditions.push({ship_type: type});
                if (include_extrapolated) {
                    orConditions.push({ship_type: "? " + type});
                }
            });
            db_query.$and.push({ $or: orConditions });
        }
        else {
            // Single type (backward compatibility)
            const type = types[0];
            if (type === "Unknown") {
                db_query.ship_type = null;
            }
            else {
                db_query.$and.push({
                    $or: [
                        {ship_type: type},
                        {ship_type: "? " + type}
                    ]
                });
                if (!include_extrapolated) 
                    db_query.$and[db_query.$and.length - 1].$or.pop();
            }
        }
    }
    if (query.page) {
        let pageParse = parseInt(query.page) || 0
        skip = Math.max(0, pageParse - 1) * ENTRY_PER_PAGE
    }
    if (query.construct_mod) {
        //TODO: populate data before even attempt this
    }
    if (query.alt_outfit_mod) {
        let val = parseInt(query.alt_outfit_mod) || 0
        if ((val >> 0) & 1) {   //base form only
            db_query.is_base = true
        }
        if ((val >> 1) & 1) {   //oath form only
            db_query.is_oath = true
        }
        if ((val >> 2) & 1) {   //retrofit form only
            db_query.is_retrofit = true
        }
        if ((val >> 3) & 1) {   //damage form only
            db_query.is_damage = true
        }
        if ((val >> 4) & 1) {   //skin form only
            db_query.is_outfit = true
        }
        if ((val >> 5) & 1) {   //alt form only
            db_query.is_base = false
        }
        if ((val >> 6) & 1) {
            db_query.is_censored = true
        }
    }
    if (query.extra_content_mod) {
        let val = parseInt(query.extra_content_mod) || 0
        if ((val >> 0) & 1) {   //voice not null
            db_query.voice = {$ne: null}
        }
        if ((val >> 1) & 1) {   //live2d
            db_query.l2d = {$ne: null}
        }
        if ((val >> 2) & 1) {   //chibi
            db_query.chibi = {$ne: null}
        }
        if ((val >> 3) & 1) {   //spine
            db_query.spine = {$ne: null}
        }
        if ((val >> 4) & 1) {   //model 3d
            db_query.m3d = {$ne: null}
        }
    }

    // if db_query.$and is empty, remove it
    if (!db_query.$and.length) {
        delete db_query.$and
    }

    // Parse sorting options
    let sort_options = {}
    if (query.sort_by) {
        const sort_fields = query.sort_by.split(',')
        sort_fields.forEach(field => {
            if (field) {
                const direction = field[0] // 'a' for ascending, 'd' for descending
                const field_name = field.slice(1) // the actual field name
                
                if (field_name === 'random') {
                    // For random sorting, we'll handle this differently with aggregation
                    return
                }
                
                // Map frontend field names to database field names
                let db_field_name = field_name
                switch (field_name) {
                    case 'char':
                        db_field_name = 'char'
                        break
                    case 'modifier':
                        db_field_name = 'modifier'
                        break
                    case 'folder':
                        db_field_name = 'folder'
                        break
                    case 'file_size':
                        db_field_name = 'file_size'
                        break
                    case 'file_modified_date':
                        db_field_name = 'file_modified_date'
                        break
                    default:
                        db_field_name = field_name
                }
                
                // Set sort direction: 1 for ascending, -1 for descending
                sort_options[db_field_name] = direction === 'a' ? 1 : -1
            }
        })
    }

    // Check if random sorting is requested
    const has_random_sort = query.sort_by && query.sort_by.includes('random')

    // console.dir(db_query, {depth: null})

    let query_res
    if (has_random_sort) {
        // Use aggregation pipeline for random sorting
        const pipeline = [
            { $match: db_query },
            { $sample: { size: ENTRY_PER_PAGE } }
        ]
        
        // Add additional sorting if there are other sort fields
        if (Object.keys(sort_options).length > 0) {
            pipeline.push({ $sort: sort_options })
        }
        
        query_res = await db.aggregateRecord('shipgirl', pipeline)
            .catch(e => {
                console.error(e)
                res.status(500).send("Internal server error")
            })
    } else {
        // Regular query with sorting
        query_res = await db.queryRecordLimit('shipgirl', db_query, ENTRY_PER_PAGE, {}, sort_options, skip)
            .catch(e => {
                console.error(e)
                res.status(500).send("Internal server error")
            })
    }
    if (!query_res) {
        return res.status(404).send("Not Found")
    }

    //if (query)
    return res.status(200).send(query_res)
})

router.get('/cg/:id', (req, res) => {
    let id = req.params.id
    if (!ObjectId.isValid(id))
       return res.status(404).send("Not found")
       
    db.queryRecord('shipgirl', {_id: ObjectId(id)})
        .then(db_res => {
            if (!db_res || !db_res.length) {
                return res.status(404).send("Not found")
            }
            return res.status(200).send(db_res[0])
        })
        .catch(e => {
            res.status(500).send("Internal server error")
        })
})

router.get('/random', async (req, res) => {
    const db_agg = [
        {$match: {}},
        {$sample: {size: 1}}
    ]
    let random_res = await db.aggregateRecord('shipgirl', db_agg)

    return res.status(200).send(random_res)
})

router.post('/get_fav', jsonParser, async (req, res) => {
    const { char, folder, fav } = req.body

    if (!char || !folder) {
        return res.status(400).send("Bad request")
    }

    let db_res = await db.queryRecord('favorite', {char: char, folder: folder})

    if (!db_res || !db_res.length) {
        // create new entry
        db_create_res = await db.addRecord('favorite', {char: char, folder: folder, fav: []})
    }

    return res.status(200).send({
        count: db_res[0]?.fav.length || 0,
        is_fav: db_res[0]?.fav.findIndex(e => e.id === fav) > -1
    })
})

router.post('/toggle_fav', jsonParser, async (req, res) => {
    const { char, folder, fav } = req.body

    if (!char || !folder || !fav) {
        return res.status(400).send("Bad request")
    }

    let db_res = await db.queryRecord('favorite', {char: char, folder: folder})

    let fav_list = db_res[0]?.fav || []
    const index = fav_list.findIndex(e => e.id === fav)
    const isFav =  index > -1
    if (isFav) {
        fav_list.splice(index, 1)
    }
    else {
        fav_list.push({id: fav, date: new Date()})
    }

    await db.editRecords('favorite', {char: char, folder: folder}, {$set: {fav: fav_list}}, {upsert: true})

    return res.status(200).send({
        count: fav_list.length || 0,
        is_fav: !isFav
    })
})

router.post('/submission', upload.single('file'), async (req, res) => {
    let file = req.file
    let body = req.body

    if (!file || !body) {
        return res.status(400).send("Bad request")
    }

    // count number of submission entry in submission collection
    let check_res = await db.queryRecord('submission', {})

    let count_res = check_res?.length ?? 0

    if (count_res > 100) {
        return res.status(400).send("Too many submission")
    }

    let db_res = await db.addRecord('submission', {
        filename: file.filename,
        folder: body.source,
        char: body.ship_name,
        uploader: body.email,
        creator: body.creator,
    }).catch(e => {
        res.status(500).send("Internal server error")
    })

    if (!db_res) return

    return res.status(200).send({
        status: "submitted"
    })
})

// TODO: cache the result
router.get('/bote_fav_lb', async (req, res) => {
    let db_res = await db.aggregateRecord('favorite', [
        { $match: {} },
        {
            $project: {
                char: 1,
                folder: 1,
                fav: { $size: '$fav' }
            }
        },
        { $sort: { fav: -1 } },
        { $limit: 40 }
    ]).catch(e => {
        console.log(e)
        res.status(500).send("Internal server error")
    })

    if (!db_res) return []

    const db_res_final = []

    // get base cg of each bote
    for (let e of db_res) {
        if (db_res_final.length >= 20) break
        const base_cg = await db.queryRecord('shipgirl', {char: e.char, folder: e.folder, is_base: true}).catch(err => {})
        if (base_cg && base_cg.length) {
            // mutate db_res entry to include base cg
            db_res_final.push({
                ...e,
                base_cg: base_cg[0].full_dir
            }) 
        }
    }

    return res.status(200).send(db_res_final)
})

router.get('/article/:id', async (req, res) => {
    // get .md file of the same name as id in data/articles folder, if not found, return 404
    const id = req.params.id
    
    const article_path = path.join(__dirname + `/../data/articles/${id}.md`)
    if (!fs.existsSync(article_path)) {
        return res.status(404).send("Not found")
    }

    const article_content = fs.readFileSync(article_path, 'utf8')

    return res.status(200).send(article_content)
})


module.exports = router