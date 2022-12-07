/* const { instrument } = require ('@socket.io/admin-ui') */
//npm i @socket.io/admin-ui     No deja instalar la dependencia del control de admin
const io = require('socket.io') (3000 , {
    cors:{
        origin: ["http://localhost:8080"],
        //origin: ["http://localhost:8080", "https://admin.socket.io"], No funciona aun porque no se instalo el admin-ui
    }
})

const userIo = io.of('/user')           //Creamos nuestro propio namespaces personalizado
userIo.on('connection', socket => {
    console.log('connected to user namespace with username' + socket.username)      /* Sacamos el nombre del usuario, en este caso test */
})

//Middleware
userIo.use((socket, next) => {
    if(socket.handshake.auth.token){
        socket.username = getUsernameFromToken(socket.handshake.auth.token)
        next()
    } else {
        next(new Error ("Please send token"))
    }
})

function getUsernameFromToken(token){
    return token
}

io.on('connection', (socket) => {
    console.log('cliente conectado', socket.id );
    socket.on('unirme_sala', (sala_id) => {
        // console.log(sala_id);
        socket.join(sala_id);
    });
    socket.on('actualizar_diagrama', (data, sala_id) => {
        // console.log(sala_id);
        io.to(sala_id).emit('diagrama_actualizado', data);
    });
})

/* instrument(io, { auth:false }) */