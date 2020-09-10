// var show = new Object(),
//     name = 'string',
//     studio = 'string',
//     season = 'string',
//     length = 'string',
//     status = 'string',
//     synopsisSource = 'string',
//     synopsis = 'string',
//     platforms = [],
//     coverImage = 'string'
//     imagesUrls = {}

class Show{
    constructor(
        name,
        studio,
        season,
        length,
        status,
        platforms,
        coverImage,
        imageUrls
    ){
    this.name = name;
    this.studio = studio;
    this.season = season;
    this.length = length;
    this.status = status;
    this.platforms = platforms;
    this.coverImage = coverImage;
    this.imageUrls = imageUrls;
    }
}

let Violet_Evergarden = new Show(
    'Violet Evergarden',
    'Kyoto Animation',
    'Winter 2018',
    '13 Episodes',
    'Finished airing',
    ['Netflix'],
    'static/violet1.png',
    [
        'static/violet1.png',
        'static/violet2.png',
        'static/vioelt3.png'
    ]
);

let Your_Name = new Show(
    'Kimi no Na wa',
    'CoMix Wave Films',
    'August 2016',
    'Movie',
    'Finished airing',
    ['Amazon Prime Video'],
    'static/violet1.png',
    [
        'static/violet1.png',
        'static/violet2.png',
        'static/vioelt3.png'
    ]
);

const shows = [
    Violet_Evergarden,
    Your_Name
]

export {shows};