const cheerio = require('cheerio');
const Iconv    = require('iconv-lite'),
    fromEnc  = 'cp1251',
    toEnc    = 'utf-8';


function getEvent(data){
    let $ = cheerio.load(body);
    return new Promise((resolve, reject)=>{
        if($('Event_Overview Event') != 0){
            let event = new Object()
            external_id = $('Event').attr('extdt')
            event = new Object();
            event._id = external_id//$('Event').attr('id');
            event.name = $('Event').attr('name');
            //event.ExtDt = $('Event').attr('extdt');
            event.ext_id = external_id;
            
            setValue(db.events, event)
            resolve()
        }
    })    
}
