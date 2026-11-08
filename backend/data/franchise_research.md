# Franchise research notes

Research notes for `backend/data/franchise_list.json`.

- Research date: 2026-11-08
- Scope: the 30 titles in the request, plus the two existing non-game catalogue
  entries (`Artist Original Content`, `Maiden Fleet`).
- Languages checked: English, Japanese, Chinese (Simplified/Traditional).
- Counts are from `backend/data/shipgirl_list_db_new.json` (one row per CG file)
  unless stated otherwise. The old counts in the request are kept as
  `reported_count` so the change is traceable.

## Conventions

- `name` remains the asset folder name so CG lookups keep working.
- `display_name` is the commonly used English title.
- `aliases` records English / Chinese / Japanese names separately.
- `general_info` is human-readable and is rendered by the franchise page.
- `cg_info` is structured data: current count, reported (old) count, quality,
  variants, notes, and a flag breakdown.
- `sources` records language and source type.
- Flag breakdowns come from the database booleans (`is_base`, `is_damage`,
  `is_retrofit`, `is_outfit`, `is_oath`, `is_censored`, `include_bg`). Flags can
  overlap, so the sub-counts do not necessarily add up to `total`.

## Current local CG counts

| Folder | Current | Old count in request | Difference |
|---|---:|---:|---:|
| Abyss Horizon | 430 | 363 | +67 |
| Axis Senki / Akushizu Senki | 338 | 335 | +3 |
| Arms Armory / Arms Amory | 17 | 17 | 0 |
| Arpeggio of Blue Steel | 34 | 34 | 0 (+23 non-game graphics) |
| Azur Lane | 4,328 | 3,229 | +1,099 |
| Battleship Bishoujo Puzzle | 142 | 142 | 0 |
| Battleship Girl | 447 | 450 | -3 |
| Battleship War Girl | 30 | 30 | 0 |
| Black Surgenights | 453 | 424 | +29 |
| Blue Oath | 368 | 363 | +5 |
| Codename Coastline | 23 | 23 | 0 |
| Counter Arms | 107 | 107 | 0 |
| Deep Sea Desire | 11 | 11 | 0 |
| Goddess Fleet | 40 | 41 | -1 |
| Guardian Project | 73 | 70 | +3 |
| Kantai Collection | 3,496 | 2,881 | +615 |
| Lane Girls | 182 | 168 | +14 |
| Mirage of Steelblue | 45 | 43 + 2 unlabeled | 0 (now labeled) |
| Moe Moe World War II | 34 | 34 | 0 |
| Monster Strike | 17 | 17 | 0 |
| Oath x Girls (Tales of Abyss) | 65 | 64 | +1 |
| Rick G Earth | 12 | 12 | 0 |
| Shipgirls Collection / Shipgirl Collection | 100 | 100 (+589 unlabeled) | 0 labeled |
| Shipgirls GO | 178 | 179 | -1 |
| Shoujo Heiki | 7 | 7 | 0 |
| The Cute Warship | 170 | 170 (+3 unlabeled) | 0 |
| Velvet Code | 255 | 193 | +62 |
| Victory Belles | 260 | 159 | +101 |
| Warship Collection | 31 | 31 | 0 |
| Warship Girls R | 3,216 | 2,661 | +555 |

## Title notes

### Abyss Horizon

- EN: Abyss Horizon; ZH: 深渊地平线; JP: アビス・ホライズン
- Developer: 重庆煜颜文化传播 (Chongqing Yuyan Culture)
- Publisher: CN 心动网络; JP/KR Y.Y. Global; TW/HK/MO 龙成网络; Global Illusion Studios
- Release: JP 2018-06-28 → 2021-02-19; TW/HK/MO 2019-01-16 → 2021-01-29;
  KR 2019-05-16 → 2020-10-31; Global 2019-12-25 → 2021-02-26;
  CN 2020-07-23 → 2021-07-15.
- Status: End of Service (all regions).
- CG: 430 current, 363 reported. Quality Meh–Good. Variants: retrofit,
  alternate outfits, CN censored versions, abyssal forms.
- Notes: Sega/C2 Preparat litigation over similarities to KanColle Arcade;
  MorningTec withdrew and Y.Y. Global took over. The EN server asset set is the
  primary source and is the reason the current count is higher than the old one.
- Sources: GameKee, Fandom, 4Gamer, Japanese Wikipedia.

### Axis Senki / Akushizu Senki

- EN: Akushizu Senki (historical romanization "Axis Senki");
  JP: あくしず戦姫～戦場を駆ける乙女たち～
- Developer: Donuts; Publisher: IKAROS Publications.
- Release: 2017-03-28 → 2018-04-27 (Japan only).
- Status: End of Service.
- CG: 338 current, 335 reported. Quality Okay. Variants: rarity variants,
  alternate outfits.
- Notes: Spin-off of the magazine `MC☆あくしず`. The asset folder is still
  `Axis Senki`, so `name` is unchanged; the corrected title is in
  `display_name`.
- Sources: atwiki pages 52 and 61, Gamerch, Gamebiz.

### Arms Armory / Arms Amory

- EN: Arms Amory (folder spelling "Arms Armory"); JP: アームズアーモリー
- Developer: MIKAGE LLC.; Publisher: EXNOA LLC. (DMM GAMES).
- Release: 2023-09-12 → 2024-03-14 (Japan).
- Status: End of Service (the old entry said Active).
- CG: 17 current, 17 reported. Quality Meh–Good.
- Notes: DMM browser SRPG about anthropomorphized land/sea/air weapons.
- Sources: wikiru, OnlineGamePlanet, DMM GAMES.

### Arpeggio of Blue Steel

- EN: Arpeggio of Blue Steel; JP: 蒼き鋼のアルペジオ -アルス・ノヴァ- Re:Birth;
  ZH: 苍蓝钢铁的琶音
- Developer: Gamegate, Inc.; Publisher: Gamegate / DMM GAMES.
- Release: mobile 2019-05-15, PC 2019-05-20 → 2020-01-31.
- Status: End of Service.
- CG: 34 game CGs current and reported. Quality Good. Plus 23 non-game
  graphics of Poor–Meh quality.
- Notes: Based on the Ark Performance manga and the Ars Nova anime. The 23
  non-game graphics are promotional/anime material and are tracked separately
  from the game CG count.
- Sources: Fandom, OnlineGamePlanet, Gamebiz.

### Azur Lane

- EN: Azur Lane; ZH: 碧蓝航线; JP: アズールレーン
- Developer: Shanghai Manjuu / Xiamen Yongshi.
- Publisher: CN bilibili; JP/WW Yostar; KR XD Global; TW/HK/MO PWB Play.
- Release: CN 2017-05-27; JP 2017-09-14; KR 2018-02-27;
  Global 2019-05-20; TW/HK/MO 2019-10-04. Still active.
- CG: 4,328 current, 3,229 reported. Quality Good. Variants: retrofit,
  CN censored versions, alternate outfits, backgrounds.
- Notes: Largest CG set in the library. EN and CN clients are the main sources;
  background-inclusive files are kept as separate rows.
- Sources: Fernando2603/AzurLane, AzurAPI, Japanese Wikipedia.

### Battleship Bishoujo Puzzle

- EN: Battleship Bishoujo Puzzle / Puzzle Girls; JP: パズルガールズ;
  ZH: 宇航少女
- Developer: 北京草帽互娱网络科技有限公司 (Hat4Love);
  Publisher: アイゼンクラウドゲーム (Eisen Cloud Game).
- Release: 2021-07-25 → 2023-12-28 (Japan).
- Status: End of Service (the old entry said Active).
- CG: 142 current, 142 reported. Quality Good.
- Notes: Space-themed match-3 RPG. The game had a well-publicized server
  outage in July 2023 before the December shutdown.
- Sources: Game8, Japanese Wikipedia, ITmedia.

### Battleship Girl -鋼鉄少女-

- EN: Battleship Girl; JP: Battleship Girl -鋼鉄少女-; ZH: 钢铁少女
- Developer/publisher: 萌貓喵 (Moe Cat); original manga by ZECO.
- Release: April 2016 → 2018-01-10 (Chinese-speaking regions; Japanese voices).
- Status: End of Service.
- CG: 447 current, 450 reported. Quality Meh–Good. Variants: damaged, retrofit,
  alternate outfits.
- Notes: Based on ZECO's manga. Three CGs from the old count are missing or
  renamed in the current library.
- Sources: Moegirl, archived Twitter, Gamersky, wikiwiki.

### Battleship War Girl

- EN: Battleship War Girl; ZH: 碧海舰姬
- Developer/publisher: unknown.
- Release: unconfirmed.
- Status: End of Service (inferred; the old entry said End of Service).
- CG: 30 current, 30 reported. Quality Poor–Okay. Variants: alternate outfits.
- Notes: Very obscure Chinese shipgirl card game. The official Facebook page is
  the main trace. No reliable release or shutdown date was found. Not the same
  game as Lane Girls / 舰姬.
- Sources: official Facebook page, 9game page.

### Black Surgenights

- EN: Black Surgenights / Dark Boom; ZH: 黑潮：深海觉醒;
  JP: ブラック・サージナイト
- Developer: 宅極電工作室 (Zhaijidian Studio).
- Publisher: CN/JP bilibili; TW/HK/MO/SEA KOMOE GAME (小萌科技).
- Release: TW/HK/MO and SEA 2020-10-15 → 2022-09-09;
  JP 2021-05-20 → 2022-06-30.
- Status: End of Service.
- CG: 453 current, 424 reported. Quality Good. Variants: abyssal forms,
  no-rigging forms, alternate outfits.
- Notes: Developed as `Project:D` / `Abyss Front`. Every shipgirl has an
  abyssal form. The JP version assets are the primary source.
- Sources: Dark Boom Miraheze, Japanese Wikipedia, Chinese Wikipedia.

### Blue Oath

- EN: Blue Oath; ZH: 苍蓝誓约; JP: 蒼藍の誓い-ブルーオース
- Developer: 北京巴别时代科技股份有限公司 (Babeltime).
- Publisher: CN Babeltime; JP Zephyrus Games; TW/HK/MO Panda Games.
- Release: CN 2019-07-16 → 2022-03-10; JP 2020-04-07 → 2023-08-31;
  TW/HK/MO 2020-06-24 → 2020-12-31.
- Status: End of Service.
- CG: 368 current, 363 reported. Quality Okay–Good. Variants: retrofit,
  damaged, no-rigging, alternate outfits.
- Notes: 3D real-time naval RPG with Japanese voices. The spin-off is listed as
  Oath x Girls. The old entry said Active; all servers are now closed.
- Sources: Blue Oath Miraheze, wikiwiki, Biligame, Japanese Wikipedia.

### Codename: Coastline

- EN: Codename: Coastline; ZH: 代号：海岸线
- Developer/publisher: unknown.
- Release: unconfirmed.
- Status: End of Service (inferred; release details are unclear).
- CG: 23 current, 23 reported. Quality Okay. Variants: alternative variant.
- Notes: Announced in 2019 with story cooperation from Kadokawa Aoba. Public
  release and shutdown details are poorly documented; the surviving assets may
  come from a test build.
- Sources: Gamersky, 9game, Ali213.

### Counter Arms

- EN: Counter Arms; JP: カウンター・アームズ -終焉武装少女-;
  ZH: 零之战线
- Developer/publisher: Ujoy Games.
- Release: 2021-05-13 → 2023-05-30 (Japan).
- Status: End of Service.
- CG: 107 current, 107 reported. Quality Okay–Good. Variants: rarity variants,
  alternate outfits, oath skins.
- Notes: Idle RPG about anthropomorphized military vehicles.
- Sources: official Twitter, OnlineGamePlanet, Gamebiz.

### Deep Sea Desire

- EN: Deep Sea Desire; ZH: 深海禁欲
- Developer/publisher: unknown (related to 超次元大海战).
- Release: unconfirmed.
- Status: End of Service (inferred).
- CG: 11 current, 11 reported. Quality Good.
- Notes: Adult shipgirl game related to the defunct 超次元大海战. The extraction
  is incomplete and public documentation is scarce.
- Sources: Mylsj game page, Gamer forum.

### Goddess Fleet

- EN: Goddess Fleet; ZH: 女神舰队
- Developer/publisher: `nvshenjiandui` Studio.
- Release: unconfirmed (download page updated 2019-04-23).
- Status: End of Service (inferred).
- CG: 40 current, 41 reported. Quality Okay.
- Notes: Small Chinese shipgirl card game. The download page noted server
  problems in 2019. One CG from the old count is missing.
- Sources: 3839, 3DM, Ali213.

### Guardian Project

- EN: Guardian Project; JP: ガーディアン・プロジェクト (守護プロ);
  ZH: 超次元大海战D
- Developer: 江苏甲子网络科技有限公司 (Jiangsu Jiazi).
- Publisher: CN 次元游戏社; JP Willow Entertainment; TW/HK/MO 老司机游玩.
- Release: CN 2019-05-16 → 2020-04-08; JP 2019-06-14 → 2020-04-07;
  TW/HK/MO 2021-07-20 → 2022-07-19.
- Status: End of Service.
- CG: 73 current, 70 reported. Quality Meh–Okay.
- Notes: 3D naval RTS. The Japanese server stopped connecting on 2020-04-07
  without a formal shutdown announcement.
- Sources: wikiwiki, AppMedia, Japanese Wikipedia.

### Kantai Collection

- EN: Kantai Collection / KanColle; JP: 艦隊これくしょん -艦これ-;
  ZH: 舰队Collection
- Developer: Kadokawa Games / C2机关; Publisher: DMM.com (EXNOA).
- Release: 2013-04-23 (Japan, still active).
- Status: Active.
- CG: 3,496 current, 2,881 reported. Quality Okay–Good. Variants: retrofit,
  damaged, alternate outfits, seasonal.
- Notes: The original shipgirl browser game. The local set includes seasonal
  and damaged art.
- Sources: Kancolle Wiki image list, Japanese Wikipedia.

### Lane Girls / Warship Hime

- EN: Lane Girls / Warship Hime; ZH: 舰姬 / Warship-HIME;
  JP: 最終戦艦withラブリーガールズ; TW: 請命令！提督SAMA;
  KR: 소녀함대 (Girls Fleet)
- Developer: 成都金角网络科技 (Chengdu Jinjiao).
- Publisher: CN 上海绿岸; JP/KR Gamepub; TW/HK/MO 科众智能 (Lunplay);
  SEA 成都哆可梦.
- Release: KR 2017-01-18 → 2019-03-15; CN 2017-07-25 → 2019-12-31;
  JP 2017-08-22 → 2019-03-28; TW/HK/MO 2017-09-19 → 2020-10-31;
  SEA 2018-02-28 → 2018-11-30; TH 2018-04-26 → 2018-10-31;
  EN 2018-06-14 → 2019-07-06.
- Status: End of Service.
- CG: 182 current, 168 reported. Quality Meh–Okay. Variants: outfits/skins.
- Notes: 3D shipgirl game where ships transform in battle. All regional servers
  are closed. Not the same game as Battleship War Girl (碧海舰姬).
- Sources: Japanese Wikipedia, Chinese Wikipedia, archived homepage,
  official Twitter.

### Mirage of Steelblue

- EN: Mirage of Steelblue; ZH: 苍青幻影; JP: 蒼青のミラージュ
- Developer/publisher: Moe Fantasy (Japan).
- Release: 2018-09-08 → 2020-03-15 (Japan).
- Status: End of Service.
- CG: 45 current, 43 reported + 2 unlabeled. Quality Good. Variants: damaged.
- Notes: Warship Girls R spin-off. Only game-exclusive shipgirls are included;
  they may later move to the Warship Girls R repository.
- Sources: Mist Wiki, Japanese Wikipedia.

### Moe Moe World War II

- EN: Moe Moe World War II; JP: 萌え萌え2次大戦(略);
  ZH: 萌萌2次大战（略）
- Developer/publisher: SystemSoft Alpha.
- Release: PC 2007-12-21; PS2/PSP 2008-11-27; sequel 2009-09-25.
- Status: Released (console/PC game, no live service).
- CG: 34 current, 34 reported. Quality Poor–Okay.
- Notes: Military anthropomorphism strategy series. The index covers the first
  game's CG set.
- Sources: official site, Gamer news, Komica wiki, Moegirl.

### Monster Strike

- EN: Monster Strike; JP: モンスターストライク; ZH: 怪物弹珠
- Developer/publisher: MIXI, Inc. (XFLAG).
- Release: JP 2013-08-08; Global 2014-10-20. Still active.
- Status: Active.
- CG: 17 current, 17 reported. Quality Meh–Good.
- Notes: Only the ship-themed monsters are indexed.
- Sources: Monst AppBank, Famitsu wiki.

### Oath x Girls (Tales of Abyss)

- EN: Oath x Girls / Tales of Abbysus; JP: オース×ガールズ /
  誓約少女 〜祝砲の元に集いし戦姫たち〜; ZH: 誓约少女 / 茶之恋姬
- Developer: 北京巴别时代科技股份有限公司 (Babeltime);
  Publisher: Hong Kong Babeltime Technology.
- Release: JP 2022-10-26 → 2024-02-28; TW/HK/MO 2023-05-24 → 2024-02-29.
- Status: End of Service.
- CG: 65 current, 64 reported. Quality Okay.
- Notes: Blue Oath IP spin-off with idle battle mechanics. The TW/HK/MO version
  was retitled 茶の戀姬 and changed to tea-personification content. The asset
  folder is still `Tales of Abyss`, so `name` is kept.
- Sources: official Twitter, 4Gamer, OnlineGamePlanet, Pixiv Encyclopedia.

### Rick G Earth

- EN: Rick G Earth; JP: りっく☆じあ〜す
- Developer/publisher: Zoo Corporation (株式会社ズー) / DMM GAMES.
- Release: 2016-02-24 (still active); DMM version 2023-07-27.
- Status: Active.
- CG: 12 current, 12 reported. Quality Okay. Variants: damaged.
- Notes: Anthropomorphized Japan Ground Self-Defense Force equipment. Only the
  ship-related CGs are indexed.
- Sources: official site, DMM GAMES, Pixiv Encyclopedia.

### Shipgirl Collection (folder: Shipgirls Collection)

- EN: Shipgirl Collection; ZH: 舰娘收藏
- Developer/publisher: JWJ APP Inc. (Taiwan).
- Release: 2015 (Android; exact date unconfirmed).
- Status: End of Service.
- CG: 100 labeled current, 100 reported + 589 unlabeled. Quality Okay.
  Variants: damaged.
- Notes: Android-only KanColle clone, formerly 超姬战舰 and 海上的波妞.
- Sources: Chinese Wikipedia, KCApp swiki.

### Shipgirls GO

- EN: Shipgirls GO; ZH: 舰姬GO / 舰娘出击
- Developer/publisher: 北京卓越晨星科技有限公司.
- Release: 2015-07 (China; exact date unconfirmed).
- Status: End of Service.
- CG: 178 current, 179 reported. Quality Okay. Variants: damaged.
- Notes: Also known as 舰娘一番, 舰姬天使, 萌娘爆破. One CG from the old count
  is missing.
- Sources: Moegirl, Ali213, K73.

### Shoujo Heiki

- EN: Shoujo Heiki; JP: 少女兵器大戦
- Developer/publisher: Up-Land (アップランド).
- Release: planned summer 2018, never released.
- Status: Unreleased / cancelled.
- CG: 7 current, 7 reported. Quality Poor.
- Notes: Only official Twitter art survives. Vaporware.
- Sources: official Twitter, Gamebiz, AppMedia.

### The Cute Warship

- EN: The Cute Warship; ZH: 舰娘萌萌哒
- Developer/publisher: unknown.
- Release: 2015-11-26 (open test; China).
- Status: End of Service.
- CG: 170 current, 170 reported + 3 unlabeled. Quality Okay.
  Variants: improved forms, damaged.
- Notes: The three unlabeled CGs are not included in the count.
- Sources: Baidu Baike, 4399, 17173.

### Velvet Code

- EN: Velvet Code; ZH: 拂晓：胜利之刻 / 拂晓; JP: ヴェルヴェットコード
- Developer: 上海久游网 (Shanghai 9You).
- Publisher: CN 广州天梯互娱 → 上海久游网; JP 唯数娱乐 (GameHours);
  TW/HK/MO 汇创纪.
- Release: JP 2022-02-16 → 2023-06-28; CN 2023-03-16 (active);
  TW/HK/MO 2023-06-01 (active).
- Status: Active (CN/TW; JP closed).
- CG: 255 current, 193 reported. Quality Good. Variants: retrofit,
  alternate outfits.
- Notes: 3D bullet-hell naval shooter. The JP server closed; the CN/TW servers
  remain active as of the research date.
- Sources: Biligame, official homepage, Chinese Wikipedia.

### Victory Belles

- EN: Victory Belles; ZH: 胜利佳丽 / 胜利少女
- Developer/publisher: Black Chicken Studios.
- Release: 2023-02-22 → 2025-10-01 (worldwide iOS/Android).
- Status: End of Service (the old entry said Work in Progress).
- CG: 260 current, 159 reported. Quality Meh–Good. Variants: outfits.
- Notes: Kickstarter-funded in May 2016; released in 2023; ended after the
  publisher backed out. Assets were preserved from the cached client.
- Sources: official site, Victory Belles Wiki, Fandom.

### Warship Collection

- EN: Warship Collection; ZH: 舰姬收藏
- Developer/publisher: 上海跳跃网络科技有限公司 (Shanghai Tiaoyue).
- Release: 2017-09-28 (browser; China).
- Status: End of Service.
- CG: 31 current, 31 reported. Quality Meh–Good. Variants: damaged,
  alternate outfits.
- Notes: 6v6 shipgirl MOBA. Not the same as Shipgirl Collection.
- Sources: 17173 game page, 17173 album.

### Warship Girls R

- EN: Warship Girls R; ZH: 战舰少女R; JP: 戦艦少女R
- Developer: 上海幻萌网络科技有限公司 (Moe Fantasy).
- Publisher: CN 上海尽游网络 / 幻萌网络; JP 幻萌网络; TW/HK/MO 幻萌网络.
- Release: CN 2014-09-23 (active); TW/HK/MO 2015-07-27 → 2015-11-12 and
  2018-08-13 → 2021-08-31; TH 2016-02-22 → 2017-08-14;
  JP 2016-10-24 (active); Global 2018-12-18 → 2021-08-31.
- Status: Active (CN/JP).
- CG: 3,216 current, 2,661 reported. Quality Good. Variants: retrofit,
  damaged, alternate outfits, censored variants.
- Notes: Long-running Chinese shipgirl game. The local set includes retrofit and
  damage variants.
- Sources: Zjsnr Wiki, Warship Girls Fandom, Japanese Wikipedia.

## Non-game catalogue entries

- `Artist Original Content` (101 CGs) and `Maiden Fleet` (no CGs) are existing
  catalogue entries, not part of the requested game list. They were preserved
  unchanged.
- `ETE Chronicles` exists as an asset folder but has no CG rows in the database
  and is not in the requested list, so it was not added.

## Uncertainties / follow-ups

- **Battleship War Girl (碧海舰姬)**: no reliable release or shutdown date.
  The 30 CGs are present, but the game is very poorly documented.
- **Codename: Coastline**: public release and shutdown details are unclear;
  status is inferred from the old entry. Could be an unreleased/test build.
- **Deep Sea Desire**: adult game with very little public documentation; the
  extraction is incomplete.
- **Goddess Fleet**: only a download page and app-store-style listings survive;
  release date and shutdown date are unconfirmed.
- **Shipgirl Collection**: 589 unlabeled CGs still need identification.
- **The Cute Warship**: 3 unlabeled CGs still need identification.
- **Battleship Girl**: 3 CGs from the old count are missing/renamed.
- **Shipgirls GO**: 1 CG from the old count is missing.
- **Goddess Fleet**: 1 CG from the old count is missing.
- **Oath x Girls**: the TW/HK/MO version changed title and content to
  `茶の戀姬`; it is treated as a regional variant of the same entry.
- **Azur Lane / Kantai Collection / Warship Girls R / Velvet Code / Rick G Earth**
  are active; their counts will keep changing.
