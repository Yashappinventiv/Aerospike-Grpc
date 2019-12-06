const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader');
//const PROTO_PATH = './auth.proto'
//const NoteService = grpc.load(PROTO_PATH).NoteService

const packageDefinition = protoLoader.loadSync(
    './auth.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });

    const loadAuth = grpc.loadPackageDefinition(packageDefinition).NoteService
   const client = new loadAuth('127.0.0.1:50051', grpc.credentials.createInsecure());

// const client = new NoteService('localhost:50051',
//     grpc.credentials.createInsecure())

 client.list({}, (error, notes) => {
        if (!error) {
            console.log('successfully fetch List notes')
            console.log(notes)
        } else {
            console.error(error)
        }
    })    
