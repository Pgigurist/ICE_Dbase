const sqlite3   = require('sqlite3').verbose()
const db        = new sqlite3.Database('./ResultsDB')

////////
//EVENT
function insertEvent(event){
    db.serialize(function(){
        event.ID = parseInt(event.ID)
        event.ExtDt = parseInt(event.ExtDt)
        //console.log(event)
        let stms = db.prepare('INSERT INTO events VALUES (?,?,?,?,?,?,?,?,?)')
        stms.run(Object.values(event))
        stms.finalize()
    })
}

function updateEvent(event){
    db.serialize(function(){
        event.ID = parseInt(event.ID)
        event.ExtDt = parseInt(event.ExtDt)
        let stmt = db.prepare(`UPDATE events SET name=?, abbreviation=?, type=?, cmptype=?, date_start=?, date_end=?, place=? WHERE extdt=${event.ExtDt} AND id=${event.ID}`)
        stmt.run([event.Name, event.Abbreviation, event.Type, event.CmpType, event.Date_Start, event.Date_End, event.Place])
        stmt.finalize()
    })
}

function selectEvent(extdt){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM events WHERE extdt=${extdt}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject()
            })
        })
    })
}



function addEvent(event){
    selectEvent(event.ExtDt, event.ID)
    .then(function(row){
        if(row.length != 0){
            console.log('event already exist')
            updateEvent(event)
        }else{    
            insertEvent(event)
        }
    }).catch((err)=>{
        console.log(err)
    })
}

///TESTS
//selectEvent('1')
//updateEvent(tevent)
//addEvent(tevent)


exports.addEvent = addEvent
exports.selectEvent = selectEvent
///////////////////
//CATEGORY


function insertCategory(category){
    db.serialize(function(){
        category.ID = parseInt(category.ID)
        category.Tec_Id = parseInt(category.Tec_Id)
        category.ExtDt = parseInt(category.ExtDt)
        //console.log(category)
        
        let stms = db.prepare('INSERT INTO categories VALUES (?,?,?,?,?,?,?,?,?)')
        //stms.run(Object.values(category))
        stms.run([category.ID, category.Tec_Id, category.Name, category.Level, category.Gender, category.Type, category.ExtDt, category.TypeName])
        stms.finalize()
    })
}

function updateCategory(category){
    db.serialize(function(){
        category.ID = parseInt(category.ID)
        category.Tec_Id = parseInt(category.Tec_Id)
        category.ExtDt = parseInt(category.ExtDt)
        let stmt = db.prepare(`UPDATE categories SET tec_id=?, name=?, level=?, gender=?, type=?, typename=? WHERE extdt=${category.ExtDt} AND id=${category.ID}`)
        stmt.run([category.Tec_Id ,category.Name, category.Level, category.Gender, category.Type, category.TypeName])
        stmt.finalize()
    })
}

function selectCategory(extdt, id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM categories WHERE extdt=${extdt} AND id=${id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addCategory(category){
    selectCategory(parseInt(category.ExtDt), parseInt(category.ID))
    .then((row)=>{
        //console.log(row)
        if(row.length != 0){
            console.log('category already exist')
            updateCategory(category)
        }else{
            console.log('insert category')
            insertCategory(category)
        }
    }).catch((err)=>{
        console.log(err)
    })
}


/////TESTS
//addCategory(tcategory)
//updateCategory(tcategory)
//selectCategory(1, 1)
exports.addCategory = addCategory
exports.selectCategory = selectCategory
/////////////////////
let tsegment = {id:"6", name : "Произвольная программа test", abbreviation : "FS", extdt:"1", cat_id:'1'}


function insertSegment(segment){
    console.log('insert seg')
    segment.ID = parseInt(segment.ID)
    segment.ExtDt = parseInt(segment.ExtDt)
    segment.cat_id = parseInt(segment.cat_id)
    db.serialize(function(){
        //console.log(segment)
        let stms = db.prepare('INSERT INTO segments VALUES (?,?,?,?,?,?)')
        stms.run([segment.ID, segment.Name, segment.Abbreviation, segment.ExtDt, segment.cat_id])
        stms.finalize()
    })
}

function updateSegment(segment){
    db.serialize(function(){
        
        segment.ID = parseInt(segment.ID)
        segment.Tec_Id = parseInt(segment.Tec_Id)
        segment.ExtDt = parseInt(segment.ExtDt)
        let stmt = db.prepare(`UPDATE segments SET name=?, abbreviation=? WHERE extdt=${segment.ExtDt} AND id=${segment.ID}`)
        stmt.run([segment.Name, segment.Abbreviation])
        stmt.finalize()
    })
}

function selectSegment(extdt, id, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM segments WHERE extdt=${parseInt(extdt)} AND id=${parseInt(id)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addSegment(segment){
    selectSegment(segment.ExtDt, segment.ID, segment.cat_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('segment already exist')
            updateSegment(segment)
        }else{
            insertSegment(segment)
        }
    }).catch((err)=>{
        console.log(err)
    })
}

function selectSegmentsFromCategory(extdt, cat_id){
    db.serialize(function(){
        db.all(`SELECT * FROM segments WHERE extdt=${parseInt(extdt)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
            if(!err){
                //console.log(row)
            }
        })
    })
}
////TESTS
//addSegment(tsegment)
//updateSegment(tsegment)
//selectSegment(1,6)
//selectSegmentsFromCategory(1,1)
exports.addSegment = addSegment
exports.selectSegment = selectSegment
exports.selectSegmentsFromCategory = selectSegmentsFromCategory
////////////



//OFFICIALS
function insertOfficial(data){
    return new Promise((resolve, reject)=>{
        //segment.ID = parseInt(data.ID)
        //segment.ExtDt = parseInt(data.ExtDt)
        //segment.cat_id = parseInt(segment.cat_id)
        db.serialize(function(){
            let stms = db.prepare('INSERT INTO officials VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
            stms.run([data.Index, data.ID, data.Full_Name, data.Title, data.Family_Name, data.Given_Name, data.Initial, data.ScbName1, data.ScbName4, data.Gender, data.Nation, data.Club, data.Function, data.extdt, data.seg_id])
            stms.finalize()
            resolve()
        })
    })
}

exports.insertOfficial = insertOfficial

function updateOfficial(data){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            console.log(data)
            let stmt = db.prepare(`UPDATE officials SET index=?, full_name=?, title=?, family_name=?, given_name=?, initial=?, scbname1=?, scbname4=?, gender=?, nation=?, club=?, function=? WHERE extdt=${data.ExtDt} AND id=${data.ID} AND seg.id=${data.seg_id}`)
            stmt.run([data.Index, data.Full_Name, data.Title, data.Family_Name, data.Given_Name, data.Initial, data.ScbName1, data.ScbName4, data.Gender, data.Nation, data.Club, data.Function])
            stmt.finalize()
            resolve()
        })
    })
}
exports.updateOfficial = updateOfficial

function selectOfficial(extdt, id, seg_id){
    
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            console.log('official')
            db.all(`SELECT * FROM officials WHERE extdt=${extdt} AND id=${id} AND seg_id=${seg_id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}

function addOfficial(data){
    //console.log(data)
    selectOfficial(data.extdt, data.ID, data.seg_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('official already exist')
            updateOfficial(data)
        }else{
            insertOfficial(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addOfficial = addOfficial
////////
//PARTICIPANTS
function insertParticipant(data){
 
    db.serialize(function(){
        //console.log(data)
        let stms = db.prepare('INSERT INTO participants VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        stms.run([data.ID, data.Status, data.Type, data.Full_Name, data.Short_Name, data.TV_Long_Name, data.TV_Short_Name, data.ScbName1, data.ScbName2, data.ScbName3, data.ScbName4, data.Gender, data.Nation, data.Club, data.Music, data.Coach, data.RegNum, data.TeamName, data.TeamNation, data.Status_Changed, data.cat_id, data.extdt])
        stms.finalize()
    })
}

function updateParticipant(data){
    db.serialize(function(){
        /*
        segment.ID = parseInt(segment.ID)
        segment.Tec_Id = parseInt(segment.Tec_Id)
        segment.ExtDt = parseInt(segment.ExtDt)
        */
        let stmt = db.prepare(`UPDATE participants SET status=?, type=?,  full_name=?, short_name=?, tv_long_name=?, tv_short_name=?, scbname1=?, scbname2=?, scbname3=?, scbname4=?, gender=?, nation=?, club=?, music=?, coach=?, regnum=?, teamname=?, teamnation=?, status_changed=?, cat_id=? WHERE extdt=${data.extdt} AND id=${data.ID}`)
        stmt.run([data.Status, data.Type, data.Full_Name, data.Short_Name, data.TV_Long_Name, data.TV_Short_Name, data.ScbName1, data.ScbName2, data.ScbName3, data.ScbName4, data.Gender, data.Nation, data.Club, data.Music, data.Coach, data.RegNum, data.TeamName, data.TeamNation, data.Status_Changed, data.cat_id])
        stmt.finalize()
    })
}

function selectParticipant(extdt, id, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND id=${parseInt(id)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipant = selectParticipant

function addParticipant(data){
    selectParticipant(data.extdt, data.ID, data.cat_id)
    .then((row)=>{
        if(row.length != 0){
            console.log('participant already exist')
            updateParticipant(data)
        }else{
            insertParticipant(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addParticipant = addParticipant

function selectParticipantsFromCategory(extdt, cat_id){
    return new Promise((resolve, reject)=>{
        db.serialize(function(){
            db.all(`SELECT * FROM participants WHERE extdt=${parseInt(extdt)} AND cat_id=${parseInt(cat_id)}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject(err)
            })
        })
    })
}
exports.selectParticipantsFromCategory = selectParticipantsFromCategory


///////////
//PREFORMANCE

function insertPerformance(data){
    db.serialize(function(){
        console.log('insert perf')
        let stms = db.prepare('INSERT INTO performances VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        stms.run([data.ID, data.Start_Number, data.Start_Group_Number, data.PElmScore, data.Personal_Best, data.Personal_Best_Tot, data.Status, data.Season_Best, data.Season_Best_Tot, data.Season_Best_Rank, data.Season_Best_Index, data.StartTime, data.Prf_ID, data.seg_id, data.cat_id, data.extdt])
        stms.finalize()
    })
}

function updatePerformance(data){
    db.serialize(function(){
        
        let stmt = db.prepare(`UPDATE performances SET status=?, rank=?, points=? WHERE extdt=${data.extdt} AND id=${data.ID} AND seg_id=${data.seg_id} AND cat_id=${data.cat_id}`)
        console.log('update perf')
        console.log(data)
        stmt.run([data.Status, data.Rank, data.Points])
        stmt.finalize()
    })
}
exports.updatePerformance = updatePerformance

function selectPerformance(extdt, cat_id, seg_id, id){
    return new Promise((resolve, reject)=>{
        console.log('select perf')
        db.serialize(function(){
            db.all(`SELECT * FROM performances WHERE extdt=${extdt} AND id=${id} AND seg_id=${seg_id} AND cat_id=${cat_id}`, (err, row)=>{
                if(!err){
                    resolve(row)
                }
                reject()
            })
        })
    })
}

exports.selectPerformance = selectPerformance

function addPerformance(data){
    //console.log('add perf')
    selectPerformance(data.extdt, data.cat_id, data.seg_id, data.ID)
    .then(function(row){
        if(row.length != 0){
            console.log('performance already exist')
            updatePerformance(data)
        }else{    
            insertPerformance(data)
        }
    }).catch((err)=>{
        console.log(err)
    })
}
exports.addPerformance = addPerformance

async function selectSegmentPerformances(extdt, cat_id, seg_id){
    db.all(`SELECT * FROM performances WHERE extdt=${extdt} AND seg_id=${seg_id} AND cat_id=${cat_id} JOIN participants full_name ON performances.pct_id=participants.id`, (err, row)=>{
        if(!err){
            return row
        }
        
    })
}