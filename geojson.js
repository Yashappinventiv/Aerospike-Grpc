const Aerospike = require('aerospike')
let key
let GeoJSON = Aerospike.GeoJSON;

module.exports = {

    keyGeo: async function (uid) {
        return new Promise((res, rej) => {
            key = new Aerospike.Key('test', 'polygon', uid);
            console.log(key)
            if (key) {
                res(key);
            } else {
                rej('false');
            }
        })
    },

    secondaryIndexForGeoQuery: async function (client) {
        return new Promise(async (res, rej) => {
            try {
                var options = {
                    ns: 'test',
                    set: 'polygon',
                    bin: 'local_Point',
                    index: 'location_Index_local_Point',
                }

                let responseData = await client.createGeo2DSphereIndex(options)
                console.log(responseData);
                res(responseData);
            } catch (err) {
                rej(err);
            }

        })
    }
    ,


    removeIndex: async function (client) {
        return new Promise(async (res, rej) => {
            try {
                await client.indexRemove('test', 'location_Index_check')
                res('true');
            } catch (e) {
                console.log('............error from remove index', e.message)
            }
        })
    },


    insert_PointQuery_In_Bins: async function (client) {

        return new Promise(async (res, rej) => {
            try {

                let location = new GeoJSON({ type: 'Point', coordinates: [22, 22] })
                let responseData = await client.put(key, { local_Point: location })
                console.log('..........', responseData)
                res(responseData)
            } catch (e) {
                console.log('............error is', e);
                rej(e)
            }
        })

    },

    insert_Polygons_In_Bins: async function (client) {

        return new Promise(async (res, rej) => {
            try {

                let location = new GeoJSON({ type: 'Polygon', coordinates: [[[20, 20], [20, 30], [30, 30], [30, 0], [20, 20]]] })
                let responseData = await client.put(key, { local_Point: location })
                console.log('..........', responseData)
                res(responseData)
            } catch (e) {
                console.log('..........error is', e);
                rej(e)
            }
        })

    }

    ,
    check_points_inside_polygon: async function (client) {
        try {

            let polygon = GeoJSON.Polygon([0, 0], [0, 10], [10, 10], [10, 0], [0, 0]);
            let query = client.query('test', 'testset');
            query.select('geo_query_bin');
            query.where(Aerospike.filter.geoContainsGeoJSONPoint('geo_query_bin', polygon))
            let stream = query.foreach();

            stream.on('error', (error) => {
                 console.log('............error', error)
                   rej(error) 
                })
            stream.on('data', (record) => {
                console.log('..............records are', record);
            })
            
        } catch (e) {
            console.log('..................error are', e.message);
        }


    }
    ,

    check_polygon_contains_point_Type1 : async function (client) {
        return new Promise(async(res, rej) => {

            try {
                let point = GeoJSON.Point(0, 0)
                let query = client.query('test', 'polygon');
                query.select('local_Point');
                query.where(Aerospike.filter.geoWithinGeoJSONRegion('local_Point', point))
                let stream = query.foreach();

                stream.on('error', (error) => {
                    console.log('............error', error)
                     rej(error)
                })
                stream.on('data', (record) => {
                    console.log('..............records are', record);
                    res(record);
                })
               
            } catch (e) {
                console.log('...............error is........', e.message)
                rej(e)
            }

        })


    }
    ,

    check_polygon_contains_point_Type2 : async function(client){

        return new Promise( async(res , rej) => {
          try{
            let query = client.query('test', 'polygon');
            query.select('local_Point');
            query.where(Aerospike.filter.geoContainsPoint('local_Point', 0,0)) ;
            let stream = query.foreach()
            stream.on('error', (error) => {
                console.log('............error', error)
                 rej(error)
            })
            stream.on('data', (record) => {
                console.log('..............records are', record);
                res(record);
            })
          }catch(err){
                console.log('err is ..........' , err);
                rej(err);
          }
          

            
        } )

    } 
,
    circleQuery: async function (client) {

        let locationCircle = new GeoJSON({ "type": "AeroCircle", "coordinates": [[-122.250629, 37.871022], 300] })
        let responseData = await client.put(key, { cicleLoc: locationCircle });
        console.log(responseData);

    }
}
