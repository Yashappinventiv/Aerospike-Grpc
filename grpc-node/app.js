const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader');
//const PROTO_PATH = __dirname + config.get("directory.static.proto.auth.server") 
const packageDefinition = protoLoader.loadSync(
     'auth.proto',
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    });
//const notesProto = grpc.load('auth.proto')
const notesProto = grpc.loadPackageDefinition(packageDefinition);

const notes = [
    { id: '1', title: 'Note 1', content: 'Content 1'},
    { id: '2', title: 'Note 2', content: 'Content 2'},
    { id: '3', title: 'Note 3', content: 'Content 3'}
]
const server = new grpc.Server()
server.addService(notesProto.NoteService.service, {
    list: (_, callback) => {
        callback(null, notes)
    },
})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())

console.log('Server running at http://127.0.0.1:50051')
server.start()