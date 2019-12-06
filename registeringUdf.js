//udf registering 

module.exports = {
   
    udfRegister : async function(client , path){
        client.udfRegister( path , function (error) {
            if (error) {
              console.error('Error: %s [%d]', error, error.code)
            }
          })  
    } , 

    udfRemove : async function(client , path){
        client.udfRemove(path, function (error) {
            if (error) {
              console.error('Error: %s [%d]', error.message, error.code)
            }
          })
    } ,

   

}


