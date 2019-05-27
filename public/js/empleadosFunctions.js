const funcionE = {};
const dbE = require('../db/connEmpleados');

funcionE.empleadosCorreo= (gafete, callback)=>{

    dbE.query(`SELECT emp_correo from del_empleados WHERE emp_id= ${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].emp_correo);
        }
    })

}


funcionE.empleadosCount=(gafete,callback)=>{
    dbE.query(`SELECT COUNT( * ) AS count FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].count);
        }
    })

}

funcionE.empleadosNombre=(gafete,callback)=>{
    dbE.query(`SELECT emp_nombre FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].emp_nombre);
        }
    })

}

funcionE.empleadosAccess2=(callback)=>{
    dbE.query(`SELECT acc_id FROM del_accesos`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcionE.empleadosRevisarDepto=(gafete, callback)=>{
    dbE.query(`SELECT emp_dep FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].emp_dep);
        }
    })

}

module.exports = funcionE;