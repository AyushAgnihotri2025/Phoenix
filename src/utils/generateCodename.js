const codenamePrefixesList = [
    'The',
    'Operation',
    'Project',
    'Mission',
    'Codename',
    'Protocol',
    'Titan',
    'Echo',
    'Stealth',
    'Nebula',
    'Vortex',
    'Quantum',
    'Rogue',
    'Stellar',
    'Thunderstrike',
    'Shadow',
    'Nova',
    'Tempest',
    'Viper',
    'Solar',
    'Dark',
    'Spectral',
    'Iron',
    'Celestial',
    'Radiant',
    'Blackout',
    'Cosmic',
    'Inferno',
    'Chaos',
    'Sentinel',
    'Echelon',
    'Cipher',
    'Aurora',
    'Tempest',
    'Vortex',
    'Hyperion',
    'Havoc',
];

const codenameNounsList = [
    'Nightangle',
    'Kraken',
    'Phoenix',
    'Raven',
    'Eagle',
    'Storm',
    'Wolf',
    'Tiger',
    'Dragon',
    'Falcon',
    'Hawk',
    'Scorpion',
    'Spectre',
    'Griffin',
    'Ironclad',
    'Pulse',
    'Rider',
    'Spear',
    'Fury',
    'Blaze',
    'Serpent',
    'Striker',
    'Fang',
    'Flare',
    'Horizon',
    'Phantom',
    'Vortex',
    'Reaper',
    'Wrath',
    'Ghost',
    'Enigma',
    'Reborn',
    'Seraph',
    'Burst',
    'Maverick',
    'Renegade',
];

/**
 * Generates a random codename using a prefix and a noun.
 * @param {Array<string>} prefixes - List of prefix options.
 * @param {Array<string>} nouns - List of noun options.
 * @returns {string} A generated codename.
 */
const generateCodename = (prefixes = codenamePrefixesList, nouns = codenameNounsList) => {
    if (!prefixes.length || !nouns.length) {
        throw new Error('Prefix and noun lists must not be empty.');
    }

    const randomIndex = (list) => Math.floor(Math.random() * list.length);

    let chosenPrefix, chosenNoun;
    do {
        chosenPrefix = prefixes[randomIndex(prefixes)];
        chosenNoun = nouns[randomIndex(nouns)];
    } while (chosenPrefix === chosenNoun); // Ensure no duplicates

    return `${chosenPrefix} ${chosenNoun}`;
};

export default generateCodename;
