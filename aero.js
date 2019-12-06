const Aerospike = require('aerospike')
let key
const op = Aerospike.operations
let lists =  Aerospike.lists ;
let map = Aerospike.maps ;

module.exports = {

  keyDefining: async function (uid) {
    // return new Promise((res, rej) => {
    //   key = new Aerospike.Key('test', 'demo', uid);
    //   console.log(key)
    //   if (key) {
    //     res(key);
    //   } else {
    //     rej('false');
    //   }
    // })

    key = new Aerospike.Key('test', 'demo', uid);
    console.log(key)
   },

  storingData: async function (client) {
    try {
     
      let bins = {
        uid: 1000,
        name: 'yash0',
        age : 21 ,
        dob: { mm: 11, yy: 2020, dd: 5 , add : [ {city : 'abc' ,  state : 'qwerty'} ] },
        friends: [1, 2, 3, 4]
      }

      policy = {
      exists : "CREATE"  
      }
      await client.put(key, bins , policy)

    } catch (e) {
      console.log('.......error from storing data', e.message)
    }

  },

  readAllData: async function (client) {
    try {
      let key  = new Aerospike.Key('test' , 'demo' , 1000);
      let data = await client.get(key);
      console.log(data);
    } catch (error) {

      switch (error.code) {
        case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
          console.log('NOT_FOUND -', key)
          break
        default:
          console.log('ERR - ', error, key)
      }
    }
  },

  selectbinsRecord: async function (client) {
    try {
      let data = await client.select(key, ['uid', 'name'])
      console.log('................from selected bins', data);
    } catch (error) {
      console.log(error);
      console.log('Error: %s.......from selectbinsRecord', error)
    }
  } ,

  batchRead : async function(client){
      try{
        let readkeys = [
          {key : new Aerospike.Key('test', 'demo1', 1000) , read_all_bins : true} ,
          {key :  new Aerospike.Key('test', 'demo', 1000) , read_all_bins : true} ,
          {key : new Aerospike.Key('test', 'demo1', 1005) , read_all_bins : true}
        ]
        let results = await client.batchRead(readkeys) ;
       console.log(results) ;
        results.forEach(function (result) {
          
          switch (result.status) {
            case Aerospike.status.AEROSPIKE_OK:
              let record = result.record
              console.log('OK - ', record)
              break
            case Aerospike.status.AEROSPIKE_ERR_RECORD_NOT_FOUND:
              console.log("NOT_FOUND - ", result.record.key)
              break
            default:
              console.log("ERROR - %d - %s", result.status, result.record.key)
          }

        })          
      }catch(error){
          console.log('error from batchReader............' , error)
      }
  } , 

  checkExistingRecord : async function(client){
    try{
      let result =  await client.exists(key) ;
      if(result){
        console.log('......checkExisting record found' , result) ;
      }else{
         console.log('..........checkExisting record dosnt exists' ,result) 
      }
    }catch(error){
      console.log('.......existing record error' , error)
    }
    

  } , 

  deleteKey : async function(client){
    try{
      let removeKey =  new Aerospike.Key('test', 'demo', 1000);
     let removedData = await  client.remove(removeKey) 
      console.log('............removed data' , removedData)
    }catch(error){
        console.log('.......delete key error from exist' , error)
    }
   }  ,
  
//   incrementage : async function(client){
//     try{
//         let ops = [
//   op.incr('views', 1),
//   op.read('views')
// ]  

// //let result = await 
//     }catch(error){
//       console.log('.........increment error' , error)
//     }
//   }

secondaryIndex : async function(client){
  try{
    var options = {
      ns: 'test',
      set: 'demo',
      bin: 'dob.mm',
      index: 'test_demo_dobDb',
      datatype: Aerospike.indexDataType.NUMERIC
  }
  
  let job  = await client.createIndex(options) ;
  await job.waitUntilDone()
  
  }catch(err){
      console.log('...............error from index' , err.message);
  }
 
} ,

query : async function(client){

  let query = client.query('test', 'demo')
  query.select('friends') 
 query.where(Aerospike.filter.equal('dob.mm', 12  ) )  
  let stream = query.foreach()

  stream.on('error' ,  (error) => {
    console.log('............error' , error)
  })
  stream.on('data' , (record) => {
      console.log(record.bins);
      let result =   record.bins.friends ;
      console.log('array is............' , result);
      console.log(result[0]);
  })
  stream.on('end')

} ,

operationsOnList   : async function(client){
   try{
    let operations = [
       op.incr('age' , 1) ,
      lists.append('friends' , {add : 'check1' , adr1 : 'check2'}) ,
      lists.append('friends' , 999) 
   ]

   client.operate(key , operations , (err , records)  => {
     if(err){
      console.log('.............error is ' , err)
     }else{
      let bins = records.bins
      console.log(bins) ;
     }
   }) ;
  

  }catch(e){
    console.log('...................' , e.message)
  }
    
} 
,

operationsOnMap : async function(client){
    try{
     
      let operations = [
      
        map.putItems('dob' , {dd : 28})
       
      ] 
      
        client.operate(key , operations , (err , record) => {
          if(err){
            console.log(err.message)
          }else{
            console.log(record)
          }
        })

    }catch(e){
        console.log('............error is' , e.message)
    }
} , 

queryForUdf : async function(client){
  let query = client.query('test', 'demo') ; 
 // query.select('age' , 'name') ;
 // query.where(Aerospike.filter.equal('age' , 21));

  //query.where(Aerospike.filter.equal('name' , 'yash3')) ;    //single pass or array[] passed

let response = await query.apply('check' , 'matchRecords' , ["yash3" , 22  ] )
    
console.log(response)
}
,

queryForUdfBackground : async function(client){
  let query = client.query('test' , 'demo') ;
  let backgroundData_JOB = await query.background('check' , 'matchRecords' , ["yash3" , 22])
  await backgroundData_JOB
}



}
