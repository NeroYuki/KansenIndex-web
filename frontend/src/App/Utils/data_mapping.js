export const nation_name_to_twemoji_flag = (name) => {
    // if not found, get question mark
    return {
        "United Kingdom": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ec-1f1e7.svg",
        "United States": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1fa-1f1f8.svg",
        "Japan": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ef-1f1f5.svg",
        "Germany": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e9-1f1ea.svg",
        "Soviet Union": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f7-1f1fa.svg",
        "Italy": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ee-1f1f9.svg",
        "France": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1eb-1f1f7.svg",
        "China": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e8-1f1f3.svg",
        "Netherlands": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f3-1f1f1.svg",
        "Russian Empire": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f7-1f1fa.svg",
        "Spain": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ea-1f1f8.svg",
        "Australia": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e6-1f1fa.svg",
        "Thailand": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f9-1f1ed.svg",
        "Turkey": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f9-1f1f7.svg",
        "Poland": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f5-1f1f1.svg",
        "Sweden": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f8-1f1ea.svg",
        "Canada": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e8-1f1e6.svg",
        "Mongolia": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f2-1f1f3.svg",
        "Chile": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e8-1f1f1.svg",
        "Iceland": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ee-1f1f8.svg",
        "Greece": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ec-1f1f7.svg",
        "Austria-Hungary": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ed-1f1f9.svg",
        "Finland": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1eb-1f1ee.svg",
        "Yugoslavia": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1fe-1f1f9.svg",
        "South Korea": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f0-1f1f7.svg",
        "Argentina": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e6-1f1f7.svg",
        "Norway": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f3-1f1f4.svg",
    }[name] || "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/2753.svg"
} 

export const type_name_to_icon = (name) => {
    return {
        "Destroyer": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/1.png",
        "Light Cruiser": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/2.png",
        "Heavy Cruiser": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/3.png",
        "Battlecruiser": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/4.png",
        "Battleship": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/5.png",
        "Light Carrier": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/6.png",
        "Aircraft Carrier": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/7.png",
        "Submarine": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/8.png",
        "Aviation Battleship": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/10.png",
        "Repair Ship": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/12.png",
        "Monitor": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/13.png",
        "Aviation Submarine": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/17.png",
        "Large Cruiser": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/18.png",
        "Munition Ship": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/19.png",
        "Guided Missile Cruiser": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/20.png",
        "Sailing Frigate": "https://raw.githubusercontent.com/Fernando2603/AzurLane/main/images/type/22.png",
    }[name] || "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/2753.svg"
}
   