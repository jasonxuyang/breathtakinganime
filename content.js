
class Show{
    constructor(
        name,
        studio,
        season,
        length,
        status,
        platforms,
        images
    ){
    this.name = name;
    this.studio = studio;
    this.season = season;
    this.length = length;
    this.status = status;
    this.platforms = platforms;
    this.images = images;
    }
}

let Violet_Evergarden = new Show(
    'Violet Evergarden',
    'Kyoto Animation',
    'Winter 2018',
    '13 Episodes',
    'Finished airing',
    ['Netflix'],
    {
        'Violet_Evergarden_1' : 'static/violet1.png',
        'Violet_Evergarden_2' : 'static/violet2.png',
        'Violet_Evergarden_3' : 'static/violet3.png',
        'Violet_Evergarden_4' : 'static/violet3.png',
        'Violet_Evergarden_5' : 'static/violet3.png',
        'Violet_Evergarden_6' : 'static/violet3.png',
        'Violet_Evergarden_7' : 'static/violet3.png',
        'Violet_Evergarden_8' : 'static/violet3.png'
    }
);

let Your_Name = new Show(
    'Your Name',
    'CoMix Wave Films',
    'August 2016',
    'Movie',
    'Finished airing',
    ['Amazon Prime Video'],
    {
        'Your_Name_1' : 'static/violet1.png',
        'Your_Name_2' : 'static/violet2.png',
        'Your_Name_3' : 'static/violet2.png',
        'Your_Name_4' : 'static/violet2.png',
        'Your_Name_5' : 'static/violet2.png',
        'Your_Name_6' : 'static/violet1.png',
        'Your_Name_7' : 'static/violet2.png',
        'Your_Name_8' : 'static/violet2.png',
    }
);

const shows = [
    Violet_Evergarden,
    Your_Name
]

export {shows};