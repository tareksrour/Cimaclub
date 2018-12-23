const URL = {
    DOMAIN: "http://cimaclub.com",
    SEARCH:  (title) => {
        return `http://cimaclub.com/?s=${title}`;
    },
    STREAM:(q,i)=>{
        return `http://cimaclub.com/wp-content/themes/Cimaclub/servers/server.php?q=${q}&i=${i}`
    },
    HEADERS: {
        'Origin' : '',
        'Accept-Language': 'vi-VN,vi;q=0.8,fr-FR;q=0.6,fr;q=0.4,en-US;q=0.2,en;q=0.2',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

class CimaClub {

    constructor(props) {

        this.libs = props.libs;
        this.movieInfo = props.movieInfo;
        this.settings = props.settings;

        this.state = {};
    }

    async searchDetail() {

        const { httpRequest, cheerio, stringHelper, cryptoJs } = this.libs; 
        let { title, year, season, episode, type } = this.movieInfo;
        let detailUrl = false;
        let pageUrl= URL.SEARCH(title);
        if(type=='movie'){
            let html=await httpRequest.getHTML(pageUrl);
            let $=cheerio.load(html);
            let movies=$('body > div.main-content > div.sections > div > div > div');
            movies.each(function(){
                let hrefMovie = $(this).find('a').attr('href');
                if(hrefMovie!=undefined){
                    let name=$(this).find('img').attr('alt');
                    if(name.includes(title)&&name.includes(year))
                        detailUrl=hrefMovie
                }
            })
        }
        else{
            let data='#mpbreadcrumbs > span:nth-child(3) > a';
            let html=await httpRequest.getHTML(pageUrl);
            let $=cheerio.load(html);
            let shows=$('body > div.main-content > div.sections > div > div > div');
            let url=false;
            if(shows){
                let u=$(shows[0]).find('a').attr('href');
                url= $(await httpRequest.getHTML(u)).find(data).attr('href');

            }
            let data_filter=false;
            if(url!==false){
                html=await httpRequest.getHTML(url);
                $=cheerio.load(html);
                $('#TabsContents > div.tab.active > div > div.seasons').find('div').each(function () {
                    let s=$(this).text().replace("موسم","").trim()
                    if(s==season)
                    {
                        data_filter=$(this).attr("data-filter");
                        $('#TabsContents > div.tab.active > div > div.episodes').children().each(function () {
                            if($(this).attr('class')=='episode'&&$(this).attr('data-season')==data_filter){
                                let text=$(this).find('a').text().replace('الحلقة','').trim();
                                if(text==episode)
                                {
                                    detailUrl=$(this).find('a').attr('href')
                                    return;
                                }
                            }

                        });
                        return false;
                    }
                })
            }
            if(data_filter!=false){

            }
        }

        // your code here


        this.state.detailUrl = detailUrl; 
        return;
    }

    async getHostFromDetail() {
        
        const { httpRequest, cheerio } = this.libs;
        if(!this.state.detailUrl) throw new Error("NOT_FOUND");
        let url=this.state.detailUrl+"?view=1";
        let html=await httpRequest.getHTML(this.state.detailUrl+"?view=1");
        let $=cheerio.load(html);
        let hosts=[];
        let id=false;
        $('head').find('link')
            .each(function () {
            let tag=$(this);
            if(tag.attr('rel')=='shortlink')
            {
                id= tag.attr('href').replace('http://cimaclub.com/?p=','');
                return false
            }
            console.log()
        });
        for(let i=1;i<=$('#TabsContents > div.tab.active > div > ul').children().length-1;i++)
        {
            let iframe=await httpRequest.getHTML(URL.STREAM(id,i));
            let frame = iframe.match(/src\=\"([^\"]+)/i);
            frame 	   = frame != false ? frame[1] : false;
            frame && hosts.push({
                provider: {
                    url: this.state.detailUrl,
                    name: "cimaclub"
                },
                result: {
                    file: frame,
                    label: "embed",
                    type: 'embed'
                }
            });
            console.log(frame)
        }
        console.log(this.state.detailUrl);


        this.state.hosts = hosts;
    }
}

module.exports = async (libs, movieInfo, settings) => {

    const cloneMe = new CimaClub({
        libs: libs,
        movieInfo: movieInfo,
        settings: settings
    });
    await cloneMe.searchDetail();
    await cloneMe.getHostFromDetail();
    return cloneMe.state.hosts;
}
