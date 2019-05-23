const funcion = {};
const express = require('express');
const app = express();
mail_config = require('../email/conn.js');
var mailer = require('express-mailer');
mailer.extend(app, mail_config);

const db = require('../db/conn');

funcion.sendEmail= (dataEmail)=>{

    //Enviar Correos
    app.mailer.send('email.ejs', {

        //Info General
        to: dataEmail.to,
        cc:dataEmail.cc,
        subject: dataEmail.subject,
        status: dataEmail.status,
        color: dataEmail.color,
        id_orden: dataEmail.id_orden,
        creador: dataEmail.creador,
        gafete: dataEmail.gafete,
        maquina: dataEmail.maquina,
        descripcion: dataEmail.descripcion,
        fecha: dataEmail.fecha,
        clave: dataEmail.clave,

        //Info Atendida
        empleadoAtendida: dataEmail.empleadoAtendida,
        fechaAtendida: dataEmail.fechaAtendida,
        accionAtendida: dataEmail.accionAtendida,

        //Info cerrada
        empleadoCerrada: dataEmail.empleadoCerrada,
        fechaCerrada: dataEmail.fechaCerrada,
        accionCerrada: dataEmail.accionCerrada,

    }, function (err) {
        if (err) {

           // console.log(err);

            return;
        }
       // console.log('mail sent');
    });

};

funcion.buscarCorreo= (gafete, callback)=>{

    db.query(`SELECT Email from empleados WHERE Gafete= ${gafete}`, function (err, result, fields) {
        if (err) throw err;
        callback(result[0].Email)
    })

};


module.exports = funcion;