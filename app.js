const net      = require('net');
const cheerio = require('cheerio');
const io       = require('socket.io');
const Iconv    = require('iconv-lite'),
    fromEnc  = 'cp1251',
    toEnc    = 'utf-8';


//////////calc export & db export
const sqlite = require('./sqliteAPI.js')
const external_id = 1// id для  iceresults
const osis_addr = '192.168.1.47'
const osis_port = 4000
const web_host = 'www.iceresults.ru'
const web_port = 44030
///////////
//web & calc connection

const osis_client = new net.Socket()
osis_client.connect(osis_port, osis_addr,function(){
    console.log('connect to calc')
})
osis_client.on('data', function(data){
    //console.log(data)
    getPack(data)
})

/*
const result_client = new net.Socket()
result_client.connect(web_port, web_host, function(){
    console.log('connect to iceresults.ru')
    
})
result_client.on('data', function(data){
    console.log(data)
})
*/
/////////////////


var n;
var currentMessage;
var arr = Array();

function getPack(data){
    let messPart = data;  
    for(let i = 0; i < messPart.length; i++){
        if(messPart[i] == 2){
            n = 0;
            arr = Array();
        }else if(messPart[i] == 3){
            currentMessage = Iconv.decode(arr, 'win1251');
            console.log(currentMessage)
            startParse(currentMessage)
            //get_event(currentMessage)
            //console.log('mark getpack')
            //get_category(currentMessage)
            //get_startList(currentMessage)
            //get_participants(currentMessage)
        }else{
            arr[n] = messPart[i];
            n++;
        }
    }
}
////PARSER
const xml2js = require('xml2js')
const parser = new xml2js.Parser()
//
const fs = require('fs')
/*
fs.readFile('./1s2.xml', (err, data)=>{
    if(!err){
        startParse(data)
    }
})
*/
//
//////variables
let extdt = ''
let cat_id = ''
let seg_id = ''
//////
function startParse(body){
    //let extdt = ''
    //let cat_id = ''
    parser.parseStringPromise(body).then((result)=>{
        if(result.Isu_Osis.Event_Overview){
            let event = result.Isu_Osis.Event_Overview[0].Event[0].$
            sqlite.addEvent(event)
            //console.log(event)
            extdt = event.ExtDt
            let catList = result.Isu_Osis.Event_Overview[0].Event[0].Category_List[0].Category
            //console.log(catList)
            for(let i = 0; i < catList.length; i++){
                
                let category = catList[i].$
                
                category.ExtDt = extdt
                //console.log(category)
                sqlite.addCategory(category)

                let segments = catList[i].Segment_List[0].Segment
                //console.log(segments)
                
                for(let num = 0; num < segments.length; num++){
                    //console.log(num)
                    let segment = segments[num].$
                    //console.log(segment)
                    segment.ExtDt = extdt
                    segment.cat_id = category.ID
                    sqlite.addSegment(segment)
                }
            }
        
        }
        else if(result.Isu_Osis.Segment_Start){
            //настройки
            let segment_start = result.Isu_Osis.Segment_Start[0]
            let Event_Officials_List = segment_start.Event[0].Event_Officials_List[0].Official

            extdt = segment_start.Event[0].$.ExtDt
            /*
            //обработка гск
            for(let i=0; i < Event_Officials_List.length; i++){
                //console.log(Event_Officials_List[i].$) 
                Event_Officials_List[i].$.ExtDt = external_id
                //console.log(Event_Officials_List[i])
        //HARDCODE!!!
                //sqlite.insertOfficial(Event_Officials_List[i].$)
            }
            */
            //CATEGORY
            let category = segment_start.Event[0].Category_List[0].Category[0]
            
            cat_id = category.$.ID
            
            let participants_for_category = category.Participant_List[0].Participant
            //console.log(category)
            
            for(let i = 0; i < participants_for_category.length; i++){
                //console.log(`${i} | ${participants_for_category.length}`)
                let participant = participants_for_category[i].$
                participant.extdt = extdt
                participant.cat_id = cat_id
                //console.log(participant)
                sqlite.addParticipant(participant)
            }
            
            let segment = category.Segment_List[0].Segment[0]
            let seg_id = segment.$.ID

            let officials = segment.Segment_Official_List[0].Official

            for(let i=0; i < officials.length; i++){
                //officials[i].cat_id = cat_id
                officials[i].$.seg_id = seg_id
                officials[i].$.extdt = extdt
                sqlite.addOfficial(officials[i].$)
            }
            
            if(segment.Segment_Start_List[0].Performance){
                let startList = segment.Segment_Start_List[0].Performance

                for(let i=0; i < startList.length; i++){
                    startList[i].$.cat_id = cat_id
                    startList[i].$.seg_id = seg_id
                    startList[i].$.extdt = extdt
                    console.log('add perf')
                    console.log(startList[i].$)
                    sqlite.addPerformance(startList[i].$)
                }
            }
        }
        else if(result.Isu_Osis.Segment_Running){
            
            seg_id = result.Isu_Osis.Segment_Running[0].$.Segment_ID
            //console.log(result.Isu_Osis.Segment_Running[0])
            
            if(result.Isu_Osis.Segment_Running[0].Segment_Result_List){
                let performances = result.Isu_Osis.Segment_Running[0].Segment_Result_List[0].Performance
                console.log('update P')
                
                //update performance
                for(let i=0; i < performances.length; i++){
                    performances[i].$.extdt = extdt
                    performances[i].$.cat_id = cat_id
                    performances[i].$.seg_id = seg_id
                    //console.log(performances[i].$)
                    sqlite.addPerformance(performances[i].$)
                }
            }
        }
    })
}

