export const nation_name_to_twemoji_flag = (name) => {
    // if not found, get question mark
    return {
        "United Kingdom": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ec-1f1e7.svg",
        "United State": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1fa-1f1f8.svg",
        "Japan": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ef-1f1f5.svg",
        "Germany": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e9-1f1ea.svg",
        "Soviet Union": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1f7-1f1fa.svg",
        "Italy": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1ee-1f1f9.svg",
        "Free France": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1eb-1f1f7.svg",
        "Vichy France": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1eb-1f1f7.svg",
        "China": "https://cdn.jsdelivr.net/gh/twitter/twemoji@v13.0.0/assets/svg/1f1e8-1f1f3.svg",
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
   