const { createServer } = require('http');
const express = require('express');
const compression = require('compression');
const morgan = require('morgan');
const path = require('path');


/* Modificacion temporal para uso en dev mode*/
//process.env.NODE_ENV = 'production';
const pool = require('./db');
const cors = require('cors'); 
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;


const normalizePort = port => parseInt(port,10);
const PORT = normalizePort(process.env.PORT || 5000)
const app = express();
const dev = app.get('env') !== 'production';

app.use(cors());//añadido para conectar con db
app.use(express.json());//añadido para conectar con db

if(!dev){
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));
    app.use(express.static(path.resolve(__dirname,'build')));

}else{
    app.use(morgan('dev'))
}

    //Queries de actores
    //Obtener lista de actores
    app.get('/actores/get',async(req,res) => {
        try {
            const listActors = await pool.query("SELECT * FROM actores");
            res.json(listActors.rows);
        }catch(err){
            console.log(err.message);
        }
    });

    app.post('/actores/post', async(req,res) => {
        try{
            console.log(req.body);
            const postActores = await pool.query("INSERT INTO actores VALUES(DEFAULT, $1,$2);",
                [req.body.nombre, req.body.nacionalidad]);
        }catch(err){

        }
    })
      
    //Queries de peliculas
    //Obtener lista de peliculas
    app.get('/peliculas/get', async(req,res) => {
        try{
            const listPeliculas = await pool.query("SELECT * FROM peliculas");
            res.json(listPeliculas.rows);
        }catch(err){
            console.log(err.message);
        }
    });

    app.post('/peliculas/post', async(req,res) => {
        try{
            console.log(req.body);
            const date = new Date();
            const postPeliculas = await pool.query("INSERT INTO peliculas VALUES(DEFAULT,$1,$2,$3,NULL);",
                [req.body.pelicula,req.body.estudio,date]);
        }catch(err){ 
            console.log(err.message);
        }
    });

    //Queries de clientes
    //Obtener lista de clientes
    app.get('/clientes/get',async(req,res) => {
        try{
            const listClientes = await pool.query("SELECT * FROM clientes");
            res.json(listClientes.rows);
        }catch(err){
            console.log(err.message);
        }
    });

    app.post('/clientes/post', async(req,res) => {
        try{
            console.log(req.body);
            const date = new Date();
            const postClientes = await pool.query("INSERT INTO clientes VALUES (DEFAULT,$1,$2,$3,$4,'Activo',$5);",
                [req.body.cedula,req.body.nombre,req.body.direccion,req.body.telefono,date])
        }catch(err){

        }
    });

    //Queries de prestamos
    //Obtener lista de prestamos
    app.get('/prestamos/get',async(req,res) => {
        try{
            const listPrestamos = await pool.query("SELECT * FROM prestamos");
            res.json(listPrestamos.rows);
        }catch(err){
            console.log(err.message);
        }
    });

    //Queries de estudios
    //Obtener lista de estudios
    app.get('/estudios/get',async(req,res) => {
        try{
            const listEstudios = await pool.query("SELECT * FROM estudios");
            res.json(listEstudios.rows);
        }catch(err){

        }
    });

const server = createServer(app);

server.listen(PORT ,err => {
    if(err) throw err
    console.log('Server started');
})


