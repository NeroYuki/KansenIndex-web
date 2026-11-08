# Franchise research notes

Research notes for `backend/data/franchise_list.json`.

- Research date: 2026-11-08
- Scope: the 30 titles in the request, plus the two existing non-game catalogue
  entries (`Artist Original Content`, `Maiden Fleet`).
- Languages checked: English, Japanese, Chinese (Simplified/Traditional).

## Conventions

- `name` remains the asset folder name so CG lookups keep working.
- `display_name` is the commonly used English title.
- `aliases` records English / Chinese / Japanese names separately.
- `general_info` is human-readable and is rendered by the franchise page.
- `extra_info` describes gameplay and general reception. It deliberately does
  not contain CG counts.
- `cg_info` is the only place for the CG count. It also holds quality, variants,
  notes, and the date the count was refreshed.
- `sources` records language and source type.

## CG count workflow

`cg_info.count` is maintained from the local MongoDB collection
`kansen_index.shipgirl`, not typed by hand.

```powershell
# after generate_data.js and import_shipgirl_db.js --apply
node scripts/update_franchise_cg_counts.js

# preview without writing
node scripts/update_franchise_cg_counts.js --dry-run
```

`import_shipgirl_db.js --apply` calls the same updater automatically after a
successful import, so the counts stay in sync with the database. The updater
sets `cg_info.as_of` to the refresh date. Counts should not be repeated in
`general_info`, `extra_info`, or the notes below.

## Title notes

### Abyss Horizon

- EN: Abyss Horizon; ZH: 深渊地平线; JP: アビス・ホライズン
- Developer: 重庆煜颜文化传播; publishers: 心动网络 (CN), Y.Y. Global (JP/KR),
  龙成网络 (TW/HK/MO), Illusion Studios (global).
- Gameplay: real-time 3D naval combat, manual steering, formation changes, AR
  viewing mode.
- Reception: mixed. The 3D models and naval action were praised, but the first
  event and monetization were widely criticized as pay-to-win. The Japanese
  launch was overshadowed by Sega/C2 Preparat's copyright lawsuit.
- Status: all regional servers closed.
- Sources: GameKee, Fandom, 4Gamer, Japanese Wikipedia, NamuWiki.

### Axis Senki / Akushizu Senki

- EN: Akushizu Senki (historical romanization "Axis Senki");
  JP: あくしず戦姫～戦場を駆ける乙女たち～
- Developer: Donuts; publisher: IKAROS Publications.
- Gameplay: turn-based military RPG using anthropomorphized land, sea, and air
  weapons from the `MC☆あくしず` magazine.
- Reception: middling. The roster and military flavor appealed to genre fans,
  but bugs, harsh upgrade-material costs, and a short service life kept it
  niche.
- Status: End of Service (2018).
- Sources: atwiki pages 52 and 61, Gamerch, Gamebiz, Espyge.

### Arms Armory / Arms Amory

- EN: Arms Amory (folder spelling "Arms Armory"); JP: アームズアーモリー
- Developer: MIKAGE LLC.; publisher: EXNOA LLC. (DMM GAMES).
- Gameplay: browser SRPG with grid/height-based battles and anthropomorphized
  tanks, ships, and aircraft.
- Reception: poor. Pre-registration and launch were plagued by bugs and server
  problems, the systems felt unfinished, and the service closed after roughly
  half a year.
- Status: End of Service (2024).
- Sources: wikiru, OnlineGamePlanet, DMM GAMES, "星ト月ヲ見ル人" review blog.

### Arpeggio of Blue Steel

- EN: Arpeggio of Blue Steel; JP: 蒼き鋼のアルペジオ -アルス・ノヴァ- Re:Birth;
  ZH: 苍蓝钢铁的琶音
- Developer/publisher: Gamegate, Inc.; DMM GAMES platform.
- Gameplay: 3D naval strategy RPG retelling the Ars Nova story with mental
  models, fleet building, and cannon/torpedo battles.
- Reception: mixed. Fans liked the 3D ships and anime cast, but the game was
  short-lived and closed about eight months after launch.
- Status: End of Service (2020).
- Sources: Fandom, OnlineGamePlanet, Gamebiz, Chinese Wikipedia.

### Azur Lane

- EN: Azur Lane; ZH: 碧蓝航线; JP: アズールレーン
- Developer: Shanghai Manjuu / Xiamen Yongshi; publishers: bilibili (CN),
  Yostar (JP/WW), XD Global (KR), PWB Play (TW/HK/MO).
- Gameplay: side-scrolling bullet-hell shooter with fleet building, equipment,
  dorm, and oath systems.
- Reception: highly positive. It became one of the most successful shipgirl
  games worldwide, praised for character art, accessible action gameplay, and a
  long-running content cadence.
- Status: Active.
- Sources: TouchArcade, Fernando2603/AzurLane, AzurAPI, Biligame, Japanese
  Wikipedia.

### Battleship Bishoujo Puzzle

- EN: Battleship Bishoujo Puzzle / Puzzle Girls; JP: パズルガールズ;
  ZH: 宇航少女
- Developer: 北京草帽互娱网络科技有限公司 (Hat4Love); publisher:
  アイゼンクラウドゲーム.
- Gameplay: match-3 RPG with space-faring shipgirls, combo chains, skills, and
  base-building.
- Reception: mixed. The puzzle combat and character art were considered fun,
  but stamina limits, VIP-style monetization, and a rough launch hurt it.
- Status: End of Service (2023).
- Sources: Game8, App-island, GameWith, Japanese Wikipedia, ITmedia.

### Battleship Girl -鋼鉄少女-

- EN: Battleship Girl; JP: Battleship Girl -鋼鉄少女-; ZH: 钢铁少女
- Developer/publisher: 萌貓喵 (Moe Cat); original manga by ZECO.
- Gameplay: Chinese-only shipgirl game with Japanese voices and a KanColle-style
  sortie, repair, and construction loop.
- Reception: niche. The ZECO manga is well regarded, but the game had a
  troubled run with limited content and controversy, and closed in 2018.
- Status: End of Service (2018).
- Sources: Moegirl, Japanese Wikipedia, Chinese Wikipedia, NamuWiki, Game Watch.

### Battleship War Girl

- EN: Battleship War Girl; ZH: 碧海舰姬
- Developer/publisher: unknown.
- Gameplay: shipgirl card RPG; very little public information survives.
- Reception: cannot be assessed; no reliable reviews or gameplay documentation
  were found.
- Status: End of Service (inferred).
- Sources: official Facebook page, 9game page.

### Black Surgenights

- EN: Black Surgenights / Dark Boom; ZH: 黑潮：深海觉醒;
  JP: ブラック・サージナイト
- Developer: 宅極電工作室; publishers: bilibili (CN/JP), KOMOE GAME
  (TW/HK/MO/SEA).
- Gameplay: real-time tactical RPG where shipgirl "dolls" can awaken into
  darker abyssal forms.
- Reception: mixed-positive. Character art, dark worldview, and skill cut-ins
  were praised; battles were considered average and slow, the story lacked
  voice work, and the JP version had harsher gacha than the TW version.
- Status: End of Service (2022).
- Sources: App-island, GameWith, Japanese Wikipedia, Chinese Wikipedia,
  Dark Boom Miraheze.

### Blue Oath

- EN: Blue Oath; ZH: 苍蓝誓约; JP: 蒼藍の誓い-ブルーオース
- Developer: 北京巴别时代科技股份有限公司 (Babeltime); publishers: Babeltime
  (CN), Zephyrus Games (JP), Panda Games (TW/HK/MO).
- Gameplay: 3D real-time naval RPG with manual steering, speed control,
  cannon, torpedo, and air attacks, and a fully voiced cast.
- Reception: positive on presentation, mixed on monetization. Reviews praised
  the 3D models, animation, and naval combat feel, but criticized low gacha
  rates, resource pressure, and a shrinking population.
- Status: End of Service (CN 2022, JP 2023).
- Sources: App-island, Gamer, GameWith, Smhn, Blue Oath Miraheze, wikiwiki,
  Biligame.

### Codename: Coastline

- EN: Codename: Coastline; ZH: 代号：海岸线
- Developer/publisher: unknown.
- Gameplay: sci-fi shipgirl strategy RPG announced in 2019 with story
  cooperation from Kadokawa Aoba.
- Reception: cannot be assessed; no reliable reviews or release details were
  found. The surviving assets may come from a test build.
- Status: unclear; the old entry said End of Service.
- Sources: Gamersky, 9game, Ali213.

### Counter Arms

- EN: Counter Arms; JP: カウンター・アームズ -終焉武装少女-;
  ZH: 零之战线
- Developer/publisher: Ujoy Games.
- Gameplay: idle RPG about anthropomorphized land, sea, and air weapons, with
  auto-battle, formation bonuses, room decoration, and marriage.
- Reception: mixed. The generous gacha and cute characters were praised, but
  the battle system was considered generic.
- Status: End of Service (2023).
- Sources: App-island, Game8, GameWith, Gamer, official Twitter.

### Deep Sea Desire

- EN: Deep Sea Desire; ZH: 深海禁欲
- Developer/publisher: unknown; related to the defunct 超次元大海战.
- Gameplay: adult shipgirl card/strategy game.
- Reception: cannot be assessed; public documentation is scarce and the asset
  extraction is incomplete.
- Status: End of Service (inferred).
- Sources: Mylsj game page, Gamer forum, Doyo.

### Goddess Fleet

- EN: Goddess Fleet; ZH: 女神舰队
- Developer/publisher: `nvshenjiandui` Studio.
- Gameplay: Chinese shipgirl card RPG with real-time combat and collection.
- Reception: cannot be assessed; coverage is very limited. The download page
  noted server problems in 2019.
- Status: End of Service (inferred).
- Sources: 3839, 3DM, Ali213.

### Guardian Project

- EN: Guardian Project; JP: ガーディアン・プロジェクト (守護プロ);
  ZH: 超次元大海战D
- Developer: 江苏甲子网络科技有限公司; publishers: 次元游戏社 (CN),
  Willow Entertainment (JP), 老司机游玩 (TW/HK/MO).
- Gameplay: 3D real-time naval strategy RPG with fleet formation, ship
  customization, and base management.
- Reception: limited and mixed. The Japanese server stopped connecting in
  April 2020 without a formal shutdown announcement.
- Status: End of Service (CN/JP 2020, TW/HK/MO 2022).
- Sources: Japanese Wikipedia, 4Gamer, wikiwiki, AppMedia.

### Kantai Collection

- EN: Kantai Collection / KanColle; JP: 艦隊これくしょん -艦これ-;
  ZH: 舰队Collection
- Developer: Kadokawa Games / C2机关; publisher: DMM.com (EXNOA).
- Gameplay: browser-based naval card game built around resource management,
  fleet composition, repair, and sorties.
- Reception: genre-defining and widely influential; it built a large media
  franchise and remains active in Japan. The interface and grind are often
  described as old-fashioned.
- Status: Active.
- Sources: Kancolle Wiki, Japanese Wikipedia, Chinese Wikipedia.

### Lane Girls / Warship Hime

- EN: Lane Girls / Warship Hime; ZH: 舰姬 / Warship-HIME;
  JP: 最終戦艦withラブリーガールズ; TW: 請命令！提督SAMA;
  KR: 소녀함대 (Girls Fleet)
- Developer: 成都金角网络科技; publishers: 上海绿岸 (CN), Gamepub (JP/KR),
  科众智能/Lunplay (TW/HK/MO), 成都哆可梦 (SEA).
- Gameplay: 3D naval strategy and dating game where ships transform between
  ship and girl forms in battle, with base building, marriage, and guild play.
- Reception: mixed. The 3D models and relationship content appealed to fans,
  but the game was short-lived and all regional servers are now closed.
- Status: End of Service (all regions).
- Sources: Japanese Wikipedia, Chinese Wikipedia, archived homepage, official
  Twitter, note.com memorial blog.

### Mirage of Steelblue

- EN: Mirage of Steelblue; ZH: 苍青幻影; JP: 蒼青のミラージュ
- Developer/publisher: Moe Fantasy (Japan).
- Gameplay: Warship Girls R spin-off with a naval strategy RPG loop, 3D combat,
  and a story focused on game-exclusive shipgirls.
- Reception: moderate. It retained a small dedicated audience but closed in
  2020.
- Status: End of Service (2020).
- Sources: Mist Wiki, Japanese Wikipedia, Moegirl.

### Moe Moe World War II

- EN: Moe Moe World War II; JP: 萌え萌え2次大戦(略);
  ZH: 萌萌2次大战（略）
- Developer/publisher: SystemSoft Alpha.
- Gameplay: turn-based strategy plus visual-novel game about anthropomorphized
  WWII weapons.
- Reception: niche and mixed. Fans enjoy the character interactions and
  military flavor, while critics found the strategy shallow and the
  presentation low-budget. It is a cult series rather than a mainstream hit.
- Status: Released (console/PC).
- Sources: official site, 4Gamer, GameWith, Joko.jp reviews, Steam, Komica wiki,
  Moegirl.

### Monster Strike

- EN: Monster Strike; JP: モンスターストライク; ZH: 怪物弹珠
- Developer/publisher: MIXI, Inc. (XFLAG).
- Gameplay: physics-based action RPG where players flick monsters to bounce
  them into enemies, with co-op multiplayer and a huge monster roster.
- Reception: highly positive. It became one of Japan's top-grossing mobile
  games, praised for simple-to-learn, skill-based combat and cooperative play.
- Status: Active.
- Sources: Monst AppBank, Famitsu wiki, Japanese Wikipedia.

### Oath x Girls (Tales of Abyss)

- EN: Oath x Girls / Tales of Abbysus; JP: オース×ガールズ /
  誓約少女 〜祝砲の元に集いし戦姫たち〜; ZH: 誓约少女 / 茶之恋姬
- Developer: 北京巴别时代科技股份有限公司 (Babeltime); publisher: Hong Kong
  Babeltime Technology.
- Gameplay: idle strategy RPG spin-off of Blue Oath, sharing its world and
  characters with auto-battle, formation, and character-bond systems.
- Reception: mixed. The art and Blue Oath connection appealed to fans, but
  gameplay was considered thin; users also criticized the gacha.
- Status: End of Service (JP 2024, TW/HK/MO 2024).
- Sources: GameWith, 4Gamer, OnlineGamePlanet, Pixiv Encyclopedia, Japanese
  Wikipedia.

### Rick G Earth

- EN: Rick G Earth; JP: りっく☆じあ〜す
- Developer/publisher: Zoo Corporation / DMM GAMES.
- Gameplay: turn-based hex strategy game about anthropomorphized Japan Ground
  Self-Defense Force equipment, with unit crafting, capture mechanics, and
  large campaign maps.
- Reception: modest but enduring. Fans praise the military detail and
  long-running content; common complaints include small UI text, matchmaking,
  and account/data issues.
- Status: Active.
- Sources: official site, DMM GAMES, Google Play, App Store, GameWith,
  AppGet, Pixiv Encyclopedia.

### Shipgirl Collection (folder: Shipgirls Collection)

- EN: Shipgirl Collection; ZH: 舰娘收藏
- Developer/publisher: JWJ APP Inc. (Taiwan).
- Gameplay: Android card game that closely copied KanColle's interface and art
  style, with renamed characters and some original additions.
- Reception: negative; press and players called it a clone.
- Status: End of Service.
- Sources: Chinese Wikipedia, KCApp swiki.

### Shipgirls GO

- EN: Shipgirls GO; ZH: 舰姬GO / 舰娘出击
- Developer/publisher: 北京卓越晨星科技有限公司.
- Gameplay: Chinese shipgirl card game, later renamed several times.
- Reception: cannot be assessed; public coverage is sparse. It was one of many
  KanColle-inspired card games.
- Status: End of Service.
- Sources: Moegirl, Ali213, K73.

### Shoujo Heiki

- EN: Shoujo Heiki; JP: 少女兵器大戦
- Developer/publisher: Up-Land (アップランド).
- Gameplay: story-complete RPG about anthropomorphized weapons.
- Reception: none; the game was announced for summer 2018 but never released.
- Status: Unreleased / cancelled.
- Sources: official Twitter, Gamebiz, AppMedia.

### The Cute Warship

- EN: The Cute Warship; ZH: 舰娘萌萌哒
- Developer/publisher: unknown.
- Gameplay: Chinese shipgirl card game with real-time naval combat, improved
  forms, and damaged variants.
- Reception: cannot be assessed; public coverage is very limited.
- Status: End of Service.
- Sources: Baidu Baike, 4399, 17173.

### Velvet Code

- EN: Velvet Code; ZH: 拂晓：胜利之刻 / 拂晓; JP: ヴェルヴェットコード
- Developer: 上海久游网; publishers: 广州天梯互娱 → 上海久游网 (CN),
  唯数娱乐/GameHours (JP), 汇创纪 (TW/HK/MO).
- Gameplay: 3D bullet-hell naval shooter with manual dodging, six-ship fleets
  made up of three main and three support ships, Live2D characters, and a
  romance/affinity system.
- Reception: mixed. The 3D combat and character art were praised, but the
  launch suffered server and payment problems, early progression was stingy,
  and review-bombing damaged its reputation; later updates improved it.
- Status: Japanese server closed in 2023. Chinese and Taiwanese versions remain
  active on official channels as of the research date; no CN/TW closure
  announcement was found.
- Sources: Chinese Wikipedia, Biligame, GameKee, TapTap, Google Play,
  GameHours, 4Gamer, Game Watch.

#### Velvet Code roster check (2026-11)

- GameKee's current wiki roster lists 162 entries; the local library had 142
  base shipgirls before this pass.
- Missing locally: 22 ships (Tone, Minneapolis, Vanguard, Jervis, Queen
  Elizabeth, Chongqing, Yat Sen, Aquila, Giuseppe Garibaldi, Ognevoy, Chapayev,
  Derfflinger, Montpelier, Gneisenau, Independence, Amatsukaze, Unicorn,
  Zhenhai, Camicia Nera, Z2, Eldridge, Gangut) plus Akari, a special character
  with current and initial versions.
- Local-only: Arromanches, Shikinami, Vauquelin. They are not in the GameKee
  roster; their existing local assets were kept.
- CG sources: GameKee base art for the 22 missing ships; the v3.4.268 client
  bundle/cache for Gneisenau (base and `_nonH`), Z2 (base and `Z2_PL`), and the
  outfit variants Gangut_PB, Montpelier_SS, Chongqing_ED, and Independence_SS.
  Akari uses the GameKee current and initial art.
- Client extras not in the GameKee roster: Admiral Hipper, Algeria, Kersaint,
  Blucher, and San Juan appear in the v3.4.268 CG bundles; they still need
  playability verification before being catalogued.
- The refreshed Velvet Code count is recorded only in `cg_info`.

#### vc26 asset bundles (v3.4.268)

- Source: `input/vc26`, containing the extracted APK
  (`WarShip_20260625_V_3_4_B_268_37008_JiuYou_ILCPP_Arm64_encrypted.apk`) and
  the Unity cache. About 5.5 GB total: 3,542 APK asset bundles and 670 cache
  `__data` files.
- Padding is unchanged in principle: the files still need the historical
  `0xEC` strip. The current header is a 16-byte prefix
  (`1a1a0d0a...ABCD0123`) followed by more padding; the real `UnityFS` starts
  at offset `0xEC`, not at 0 or 16. `vc_scripts.js`'s `slice(0xEC)` remains
  correct.
- UnityPy 1.10.13 loads the stripped bundles. Extraction works after the
  strip; loading the first `UnityFS` at offset 16 fails with an LZ4 block
  error.
- Extractable content: Texture2D (2048x2048 character CGs, `_nonH` uncensored
  versions, 3D body/face/hair/weapon maps, UI, icons), AudioClip (character
  voice and BGM; 48 kHz mono), Mesh/SkinnedMeshRenderer/AnimationClip for 3D
  models, Live2D Cubism MonoBehaviour data in `prefab/charl2d/*`, TextAsset,
  scenes and prefabs.
- The APK bundle map resolves 3,541 of 3,542 bundles: 397 `art/charcg/*`
  bundles with 898 CG textures, 270 `art/char/*`, 224 `sound/char/*`, 293
  `prefab/char/*`, and 169 `prefab/charl2d/*`.
- `staticdata` is a 14 MB TextAsset with high-entropy content; it is not
  plaintext and needs the game's decryption key. Character IDs can still be
  mapped from texture names such as `1163-Gneisenau` and from the internal
  AssetBundle names.
- The cache is the safer source for recent hotfix characters. The APK's
  `1163-Gneisenau` texture is byte-identical to `1161-Derfflinger` (a
  duplicate/mislabeled entry), while the cache `1163-Gneisenau` has the
  correct art. Z2 is present in the cache but absent from the APK CG index.
- Extracted cache CGs are in `output/vc26/cg`; the APK CG index is
  `output/vc26/charcg_index.json`. Some APK CG bundles also contain
  uncensored `_nonH` variants, 3D body/face/hair/weapon maps, and outfit art.
- Additional client-only characters seen in the cache CG bundles but not in
  the GameKee roster: Admiral Hipper, Algeria, Kersaint, Blucher, and San
  Juan. They still need playability verification.
- Tone has two client textures: the standard `1146-Tone` is the censored
  version and `1146-Tone_nonH` is the uncensored version. Both are kept
  (`Tone.png` and `Tone_uncensored.png`).
- Akari has current and initial versions; both are kept, plus the
  `0003-Akari_skin` outfit. The current art is the larger 4340x6139 source.
- A full client CG pass selected the highest-resolution source per
  character/modifier (client APK/cache over GameKee over the old local file).
  The Velvet Code top-level CG set now includes base, uncensored, retrofit,
  and outfit art, including the client-only ships. `Ryuujo` was corrected to
  the local spelling `Ryujo`; the old `Ryuujou` duplicate was removed.
- 3D: 274 GLBs are now in `Velvet Code/char3d`; the regenerated mapping covers
  412 CGs. Models were built from the APK `art/char` bundles and the cache
  `art-char` hotfix bundles, then converted with AssetStudio CLI and FBX2glTF.
- Voice: 240 folders and 5,584 WAVs are in `Velvet Code/voice`, using the
  container folder names from `sound/char` bundles.
- L2D: the 169 unpadded bundles are in `output/vc26/l2d_bundles_unpadded`
  and `Velvet Code/Live2D_bundles_unpadded`. AssetStudioModGUI exported 180
  Live2D folders; these were copied into `Velvet Code/Live2D`. The master
  folder now has 182 Live2D folders (3,392 files). The regenerated
  `vc_l2d_mapping.json` maps 109 CGs to L2D models. The remaining L2D folders
  are alternate outfit/duplicate exports whose folder names do not carry an
  outfit code, so they are not attached to a specific CG yet.
- The remaining 22 unmapped CGs are mostly characters/outfits without a
  matching client model (for example Akari, Arromanches, Blucher, some
  Fubuki/Taihou/Laffey outfits, and a few missing model IDs).

### Victory Belles

- EN: Victory Belles; ZH: 胜利佳丽 / 胜利少女
- Developer/publisher: Black Chicken Studios.
- Gameplay: turn-based tactical RPG with WWII shipgirls, native-language voice
  acting, a branching alternate-history campaign, and equipment customization.
- Reception: mixed-positive. Backers and fans praised the character art and
  historical detail, but the long development, bugs, bare-bones tutorial,
  unvoiced characters, and outdated presentation limited its audience.
- Status: End of Service (2025).
- Sources: Pocket Gamer, TV Tropes, Fandom, Moegirl, Japanese Wikipedia,
  Chinese Wikipedia.

### Warship Collection

- EN: Warship Collection; ZH: 舰姬收藏
- Developer/publisher: 上海跳跃网络科技有限公司.
- Gameplay: browser-based 6v6 MOBA with shipgirl characters and naval maps.
- Reception: cannot be assessed; public coverage is very limited.
- Status: End of Service.
- Sources: 17173 game page, 17173 album.

### Warship Girls R

- EN: Warship Girls R; ZH: 战舰少女R; JP: 戦艦少女R
- Developer: 上海幻萌网络科技有限公司; publishers: 上海尽游网络 / 幻萌网络
  (CN), 幻萌网络 (JP/TW/HK/MO).
- Gameplay: Chinese shipgirl game with KanColle-style resources, construction,
  sorties, repair, and retrofit, plus a large roster and live2D dorm content.
- Reception: positive within its niche and still active in China and Japan.
  The grind and old-fashioned interface are common criticisms; the game is
  also noted for its long-running community and historical-ship coverage.
- Status: Active (CN/JP); TW/HK/MO, Global, and Thai servers closed.
- Sources: Zjsnr Wiki, Warship Girls Fandom, Japanese Wikipedia, Chinese
  Wikipedia, Moegirl, QooApp, Google Play.

## Non-game catalogue entries

- `Artist Original Content` and `Maiden Fleet` are existing catalogue entries,
  not part of the requested game list. They were preserved unchanged.

## Uncertainties / follow-ups

- **Battleship War Girl (碧海舰姬)**: no reliable release or shutdown date.
- **Codename: Coastline**: public release and shutdown details are unclear;
  status is inferred from the old entry.
- **Deep Sea Desire**: adult game with very little public documentation; the
  extraction is incomplete.
- **Goddess Fleet**: release date and shutdown date are unconfirmed.
- **Shipgirl Collection** and **The Cute Warship**: additional unlabeled
  artwork exists; it is not counted in `cg_info.count`.
- **Battleship Girl** and **Shipgirls GO** / **Goddess Fleet**: a few files may
  be missing or renamed.
- **Oath x Girls**: the TW/HK/MO version changed title and content to
  `茶の戀姬`; it is treated as a regional variant of the same entry.
- **Velvet Code**: the Japanese server closed in 2023. The user believed the
  CN/TW versions had also closed, but official channels and app-store pages
  showed activity through October 2026, so the entry remains Active. If a CN/TW
  shutdown announcement appears, update the status and dates.
