const express = require('express')
const app = express() ;
const Aerospike = require('aerospike')
const aeroCRUD = require('./aero')
const aerRegister = require('./registeringUdf');
const geoLoaction = require('./geojson')

  let client = Aerospike.client ( {
    hosts  : [ { addr: '127.0.0.1', port: 3000 } ]
   })


   async function start(){
    
    try {
     await client.connect()
    //  aeroCRUD.query(client) ;

  //   aeroCRUD.keyDefining(1005) ;

   // await geoLoaction.keyGeo(3) ;
   // await geoLoaction.secondaryIndexForGeoQuery(client);
     await geoLoaction.check_polygon_contains_point_Type2(client); 
      
   //  geoLoaction.polygonQuery(client);
   // await geoLoaction.removeIndex(client)
   // await  geoLoaction.pointQuery(client); 
   //   geoLoaction.insert_Polygon_In_Bins(client) ;

   //   aerRegister.udfRegister(client , './check.lua') ; 
   //   aerRegister.registerModule(client , 'checkLua')
   //  aeroCRUD.queryForUdf(client);
    //   aeroCRUD.operationsOnList(client) ;
    
   // aeroCRUD.operationsOnMap(client) ;
  //   aeroCRUD.storingData(client);
  //   await aeroCRUD.readAllData(client) ;
    //   aeroCRUD.secondaryIndex(client)
     //await aeroCRUD.selectbinsRecord(client) ;
      //aeroCRUD.batchRead(client) ;
    //  aeroCRUD.checkExistingRecord(client);
     // aeroCRUD.deleteKey(client)
      app.listen(8000 , () => {
        console.log("server connected && aerospike connected") ;
      })
      
 
     }catch(e){
       console.log("error is........ from try catch block................." , e.message)
     }
  
  }




  start() ;
  




































  //    let key = new Aerospike.Key('test', 'test', 'abcd')
  //    let bins = {
  //      name: 'Norma',
  //      age: 31
  //    }
 
  //    await client.put(key, bins)
  //    let record = await client.get(key)
  //    console.info('Record:', record)
  //    await client.remove(key)
  //  } catch (error) {
  //    console.error('Error:', error)
  //    process.exit(1)
  //  } finally {
  //    if (client) client.close()
  //  }
