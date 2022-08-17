'use strict'

const jwt = require('jsonwebtoken');
var moment = require('moment');
// var secret = "ims-systems-clave-unica";

var db = require('../db');
const { getNombreEmpresa } = require('../global');


var secret = "xLoxOhuIcYBTzOWYGctsCFnU9gA6SUW5XELkdKzYn6Do0F7sOIhzCU2hR9X2ozr";


exports.autenticacion = function(req, res, next) {

    if (req.headers.authorization === undefined){
        return res.status(500).send({message: "nada que hacer"});
    }

    console.log(req.headers.authorization);

    
    let usuario = getIDclient(req.headers);
    // let empresa = global.getNombreEmpresa(req.headers);

    console.log(usuario);


    // // verificacion de parametros en mensaje
    // if ( req.body.scope === undefined) {
    //     return res.status(500).send({message: "falta parametro de usuario"});
    // }

    // if ( req.body.scope !== 'IMS-platform') {
    //     return res.status(500).send({message: "scope erroneo"});
    // }

    // console.log('parametros token',usuario, empresa);

    // if (usuario=== undefined ) {
    //     return res.status(500).send({message: "error desconocido"});
    // }

    // // variable auxiliar
    // let variableAuxiliar = {};

    //  // busca el usuario
    // ////////////////////////////////////////////////// busqueda usuario //////////////////////////
    // busquedaUsuario(usuario).then(
    //     // verifica habilitacion de usuario
    //     resultUsuario=>{
    //         return new Promise((resolve, reject)=>{
    //                 if (resultUsuario.estado === 'habilitado'){
    //                     // console.log(resultUsuario)
    //                     variableAuxiliar.identificadorUsuario = usuario;
    //                     variableAuxiliar.identificadorEmpresa = empresa;
    //                     // resolve(resultUsuario.codigoUnico);
    //                     resolve(resultUsuario.identificadorEmpresa);
    //                 } else {
    //                     reject({mensaje:'usuario auth error 2', codigoError: 2});
    //                 }
    //             }
    //         ) 

    //     },
    //     error=>{
    //         console.log(error);
    //         return Promise.reject(error);
    //     }
    // )
    // ////////////////////////////////////////////////// busqueda empresa //////////////////////////
    // // .then(
    // //     identificadorEmpresa=>{
    // //         return new Promise((resolve, reject)=>{
    // //             console.log(identificadorEmpresa);
    // //             // variableAuxiliar.identificadorEmpresa = codigoUnico;
    // //             variableAuxiliar.identificadorEmpresa = identificadorEmpresa;

    // //             busquedaEmpresa(identificadorEmpresa).then(
    // //                 resultEmpresa => {
    // //                     // if(resultEmpresa.habilitacion === 'habilitado'){
    // //                         resolve(resultEmpresa);
    // //                     // } else {
    // //                         // reject({mensaje:'usuario auth error 3', codigoError: 3})
    // //                     // }
    // //                 },
    // //                 error=>{
    // //                     console.log(error);
    // //                     reject(error);
    // //                 }
    // //             )
    // //         }
    // //     ) 
    // //     },
    // //     error=>{
    // //         console.log(error);
    // //         return Promise.reject(error);
    // //     }
    // // )
    // ////////////////////////////////////////////////// creacion producto //////////////////////////
    // // .then(
    // //     data => {
    // //         console.log(data)
    // //         return new Promise((resolve, reject)=>{

    // //         _creacionProducto(
    // //             variableAuxiliar.identificadorEmpresa, 
    // //             variableAuxiliar.identificadorUsuario, 
    // //             req.body.nombreProducto
    // //             ).then(
    // //                 resultCreacion => {
    // //                     resolve(resultCreacion)
    // //                 }, error =>{
    // //                     reject({mensaje:'usuario auth error 4', codigoError: 4})
    // //                 })            
    // //             })
    // //     }, 
    // //     error=>{
    // //         console.log(error);
    // //         return Promise.reject(error);
    // //     }   
    // // ) 
    // //////////////////////////////////////////////////final result //////////////////////////
    // .then(finalResult => {
    //     req.parametrosAuth = {};
    //     req.parametrosAuth.usuario = variableAuxiliar.identificadorUsuario;
    //     req.parametrosAuth.empresa = variableAuxiliar.identificadorEmpresa;

    //     // parametros.user = payload;

    //     next();
    // }, finalError=>{
    //     return res.status(401).send(finalError);
    // });

    next();

};


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getIDclient (headers) {
    let token = headers.authorization.split(' ')[1];
    return jwt.decode(token, this.JWT_SECRET).IDclient;
}


// if(!req.headers.authorization){
//     return res.status(403).send({message: "error en las habilitaciones"});
// }

// let token = req.headers.authorization.split(' ')[1];


// try{
//     var payload = jwt.decode(token, secret);
//     // console.log(payload);
//     // if(payload.exp <= moment().unix()){
//     //     return res.status(401).send({message: "El token ha expirado"});
//     // }
// }catch(ex){
//     //console.log(ex);
//     return res.status(404).send({message: "El token no es valido"});
// }


// req.user = payload;



function busquedaUsuario(usuario){
    var database = db.get();
    var collection = database.db('AdministracionGeneral').collection('usuarios');
    // var collection = database.db('Usuarios').collection('Lista');
    // console.log(usuario);
    // console.log(req.body);
    var promesa = new Promise((resolve, reject) => {
        collection.findOne({identificador:usuario},function (err,searchedUser) {
            // console.log(result);
            if(err){
                reject({error:"Error en la operacion"});
            }else{
                // console.log(searchedUser);

                if(!searchedUser){
                    reject({error:"No existen operaciones"});
                }else{
                    // if(searchedUser.habilitacion===true) {
                    //     resolve (req);
                    // console.log('searchedUser', searchedUser);
                        resolve (searchedUser);
                    // }else{
                    //     reject({error:'usuario inhabilitado'});
                    // }
                }
            }
        });
    });
    return promesa;
}
