//Conexion a base de datos
const db = require('./public/db/conn');
const controller = {};

//Require mailer
const funcion = require('./public/js/controllerFunctions');

// Index GET
controller.index_GET = (req, res) => {
    res.render('index.ejs');
};

//GET Crear orden
controller.crear_orden_GET = (req, res) => {
    res.render('login.ejs');
};

//Login
controller.login = (req, res) => {
    loginId = req.params.id
    res.render('login.ejs', {
        data: loginId
    });
};

//POST a crear_orden despues de login primero revisa si el Gafete existe 
controller.crear_orden_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    db.query(`SELECT COUNT( * ) AS count FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, count, fields) {
        if (err) {
            res.redirect('/login/crear_orden')
        } else {

            if (count[0].count == 0) {
                res.redirect('/login/crear_orden')
            }
            else {

                db.query(`SELECT Nombre FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, result3, fields) {
                    if (err) throw err;
                    db.query("SELECT * FROM departamento", function (err, result1, fields) {
                        if (err) throw err;
                        db.query("SELECT * FROM maquinas", function (err, result2, fields) {
                            if (err) throw err;

                            res.render('crear_orden.ejs', {
                                data: result1, data2: result2, data3: result3[0].Nombre, data4: numeroEmpleado
                            });
                        });
                    });
                });
            }
        }
    });
};

//POST a crear_orden2 despues de crear_orden
controller.crear_orden2_POST = (req, res) => {
    departamento = (req.body.departamento);
    maquina = (req.body.maquina)
    nombreEmpleado = (req.body.empleado)
    numeroEmpleado = (req.body.gafete);

    db.query(`SELECT familia FROM maquinas WHERE nombre= '${maquina}'`, (err, result2, fields) => {
        if (err) throw err;
        familia = result2[0].familia

        db.query(`SELECT componente FROM areas_componentes_afectados WHERE familia_maquina = '${familia}'`, (err, result3, fields) => {
            if (err) throw err;

            res.render('crear_orden2.ejs', {
                data: departamento, data2: maquina, data3: result3, data4: nombreEmpleado, data5: numeroEmpleado
            });
        });
    });

};

//POST a guardar_orden despues de crear orden2
controller.guardar_orden_POST = (req, res) => {


    empleado = (req.body.empleado)
    gafete = (req.body.gafete)
    departamento = (req.body.departamento)
    parteAfectada = (req.body.componente)
    maquina = (req.body.maquina)
    turno = (req.body.turno)
    grupo = (req.body.grupo)
    descripcion = (req.body.descripcion)
    archivo = (req.body.archivo)
    clave = Math.floor(Math.random() * 10000);
    tipoOrden = (req.body.tmuerto)

    db.query(`SELECT id_maquina FROM maquinas WHERE nombre ='${maquina}'`, function (err, result1, fields) {

        if (err) throw err;
        db.query(`SELECT familia FROM maquinas WHERE nombre ='${maquina}'`, function (err, result4, fields) {
            if (err) throw err;
            familia = result4[0].familia
            db.query(`SELECT id_componente FROM areas_componentes_afectados WHERE componente ='${parteAfectada}' AND familia_maquina='${familia}'`, function (err, result3, fields) {
                if (err) throw err;
                componente = result3[0].id_componente;

                db.query(`SELECT id_departamento FROM departamento WHERE nombre='${departamento}'`, function (err, result2, fields) {
                    if (err) throw err;

                    db.query(`
                    INSERT INTO ordenes (departamento, maquina, parte_afectada, descripcion_problema, 
                    reporto, usuario_dominio, email, turno, grupo,  fecha_hora, clave, status, tipo_orden)
                    VALUES( '${result2[0].id_departamento}', '${result1[0].id_maquina}', '${componente}', '${descripcion}', 
                    '${gafete}', '${empleado}', '${empleado + '@tristone.com'}', '${turno}', '${grupo}', NOW() , '${clave}', 
                    'Abierta', '${tipoOrden}')`, (err, result, fields) => {
                            if (err) throw err;

                            db.query(`SELECT id_orden FROM ordenes WHERE clave = ${clave}`, (err, result2, fields) => {
                                id_orden = result2[0].id_orden;
                                if (err) throw err;

                                res.render('guardar_orden.ejs', {
                                    data: { departamento, maquina, turno, grupo, descripcion, clave, id_orden }
                                });
                            });
                        });
                });
            });
        })
    });

    //Enviar Correo
    db.query(`SELECT MAX(id_orden) AS id FROM ordenes`, function (err, result5, fields) {
        if (err) throw err;   
            id = result5[0].id + 1;

            

            to = 'cisco.morales.27@gmail.com'//'email';
            cc = '';
            subject = 'Nueva Orden Utra: '+id;
            status = 'Abierta';
            color = '#b30000';
            id_orden = id;
            creador = empleado;
            gafete = gafete;
            maquina = maquina;
            descripcion = descripcion;
            fecha = new Date();
            clave = clave;
            empleadoAtendida = '';
            fechaAtendida = '';
            accionAtendida = '';
            empleadoCerrada = '';
            fechaCerrada = '';
            accionCerrada = '';

            dataEmail = {
                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, clave, empleadoAtendida,
                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
            }

            funcion.sendEmail(dataEmail);      

    });

};

//Get tabla ordenes
controller.ordenes_GET = (req, res) => {
    db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
      WHERE (ordenes.departamento = departamento.id_departamento) 
      AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) ORDER BY id_orden DESC`, function (err, result, fields) {
            if (err) throw err;


            db.query(`SELECT COUNT(*) AS abiertas FROM ordenes WHERE status ="Abierta"`, function (err, result2, fields) {
                if (err) throw err;


                db.query(`SELECT COUNT(*) AS atendidas FROM ordenes WHERE status ="Atendida"`, function (err, result3, fields) {
                    if (err) throw err;


                    db.query(`SELECT COUNT(*) AS cerradas FROM ordenes WHERE status ="Cerrada"`, function (err, result4, fields) {
                        if (err) throw err;

                        ordenesAbiertas = result2[0].abiertas
                        ordenesAtendidas = result3[0].atendidas
                        ordenesCerradas = result4[0].cerradas

                        res.render('ordenes.ejs', {
                            data: result, data2: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas }
                        });
                    });
                });
            });
        });
};

//POST  a cerrar_orden despues de login, revisa primero si el Gafete existe
controller.cerrar_orden_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    db.query(`SELECT COUNT( * ) AS count FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, count, fields) {
        if (err) {
            res.redirect('/login/cerrar_orden')
        } else {

            if (count[0].count == 0) {
                res.redirect('/login/cerrar_orden')
            } else {

                db.query(`SELECT Nombre FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, result3, fields) {
                    if (err) throw err;

                    db.query(`SELECT id_orden FROM ordenes WHERE status='Abierta' OR status='atendida'`, function (err, result4, fields) {
                        if (err) throw err;


                        nombreEmpleado = result3[0].Nombre;

                        res.render('cerrar_orden.ejs', {
                            data: numeroEmpleado, data2: nombreEmpleado, data3: result4
                        });
                    });
                });
            }
        }
    });
};

//POST  cerrar_orden2 despues de cerrra_orden primero revisa si la orden existe 
controller.cerrar_orden2_POST = (req, res) => {

    numeroEmpleado = req.body.numeroEmpleado;
    nombreEmpleado = req.body.nombreEmpleado;
    id_orden = req.body.id_orden;

    db.query(`SELECT COUNT( * ) AS count FROM ordenes WHERE id_orden=${id_orden}`, function (err, count, fields) {
        if (err) {
            res.redirect('/')
        } else {

            if (count[0].count == 0) {
                res.redirect('/')
            }
            else {

                db.query(`SELECT status FROM ordenes WHERE id_orden=${id_orden}`, function (err, result2, fields) {
                    if (err) throw err;
                    status = result2[0].status
                    db.query(`SELECT clave FROM ordenes WHERE id_orden=${id_orden}`, function (err, clave, fields) {
                        if (err) throw err;
                        id_clave = clave[0].clave

                        db.query(`SELECT * FROM ordenes,areas_componentes_afectados 
                WHERE ordenes.id_orden = ${id_orden}
                AND ordenes.parte_afectada = areas_componentes_afectados.id_componente`, function (err, result1, fields) {

                                parteAfectada = result1[0].componente
                                res.render('cerrar_orden2.ejs', {
                                    data: { numeroEmpleado, nombreEmpleado, id_orden, parteAfectada, id_clave, status }
                                });
                            });
                    });
                });
            }
        }
    });
};

//POST a cambio_orden 
controller.cambio_orden_POST = (req, res) => {

    accionTomada = req.params.id;
    nombreEmpleado = req.body.nombreEmpleado;
    numeroEmpleado = req.body.numeroEmpleado;
    id_orden = req.body.id_orden;
    current_date = req.body.current_date; //Fecha sin formato
    formatted_current_date = req.body.formatted_current_date; //Fecha con formato YYYY-MM-DD hh:mm:ss
    clave_cierre = req.body.clave_cierre;
    parteAfectada = req.body.parteAfectada;
    actividades = req.body.actividades;


    db.query(`SELECT * FROM ordenes WHERE id_orden = ${id_orden}`, function (err, result, fields) {

        ordenFecha = result[0].fecha_hora;
        var startDate = new Date(ordenFecha);//Fecha en que se creo la orden de trabajo
        var endDate = new Date(current_date);//Fecha en la que se esta tendiendo la orden de trabajo, viene de cerrar_orden2(current_date)
        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        var usuarioAtendida = result[0].usuario_atendida;
        var accionAtendidaC = result[0].acciones_atendida;
        var tipoOrden = result[0].tipo_orden

        //Info correo
        reporto = result[0].reporto;
        maquina = result[0].maquina;
        descripcion = result[0].descripcion_problema;
        fechaAtendida = result[0].fecha_hora_atendida;
        accionesAtendida = result[0].acciones_atendida;
        db.query(`SELECT Nombre FROM empleados WHERE Gafete= ${reporto}`, function (err, result2, fields) {
            nombrereporto = result2[0].Nombre;
            db.query(`SELECT nombre FROM maquinas WHERE id_maquina= ${maquina}`, function (err, result3, fields) {
                nombremaquina = result3[0].nombre;

                //Si es de tipo correctivo actualiza segundos //////////////////////////////////////////////////////////
                if (tipoOrden == "Otra") {
                    seconds = 0
                } else {
                    seconds = seconds
                }

                if (accionTomada == "Atendida") {
                    clave_cierre = '';
                    db.query(`UPDATE ordenes SET 
              status= "${accionTomada}",
              acciones_atendida= "${actividades}" ,
              fecha_hora_atendida= "${formatted_current_date}" ,
              tiempo_atendida= "${seconds}",
              usuario_atendida= "${nombreEmpleado}" 
              WHERE id_orden = ${id_orden}`, function (err, result, fields) {
                            if (err) throw err;


                            res.render('cambio_orden.ejs', {
                                data: { accionTomada, nombreEmpleado, numeroEmpleado, id_orden, formatted_current_date, clave_cierre, parteAfectada, actividades }
                            });
                        });

                    gafeteEnviar = reporto;
                    for (var i = 0; i < 2; i++) {
                        funcion.buscarCorreo(gafeteEnviar, function (data) {

                            to = data;
                            cc = '';
                            subject = 'Orden Utra: ' + id_orden + ' -Atendida-';
                            status = 'Atendida';
                            color = '#3498db';
                            id_orden = id_orden;
                            creador = nombrereporto;
                            gafete = reporto;
                            maquina = nombremaquina;
                            descripcion = descripcion;
                            fecha = ordenFecha;
                            clave = clave_cierre;
                            empleadoAtendida = nombreEmpleado;
                            fechaAtendida = formatted_current_date;
                            accionAtendida = actividades;
                            empleadoCerrada = '';
                            fechaCerrada = '';
                            accionCerrada = '';

                            dataEmail = {
                                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, clave, empleadoAtendida,
                                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                            }

                            funcion.sendEmail(dataEmail);
                        })

                        gafeteEnviar = numeroEmpleado;
                    }


                } else {
                    db.query(`UPDATE ordenes SET 
                status= "${accionTomada}",
                fecha_hora_cierre= "${formatted_current_date}",
                usuario_cierre= "${nombreEmpleado}",
                acciones_cierre= "${actividades}",
                tiempo_muerto= "${seconds}",
                area_real_afectada= "NULL",
                parte_real_afectada= "NULL"
                WHERE id_orden = ${id_orden}`, function (err, result1, fields) {
                            res.render('cambio_orden.ejs', {
                                data: { accionTomada, nombreEmpleado, numeroEmpleado, id_orden, formatted_current_date, clave_cierre, parteAfectada, actividades }
                            });
                        });

                    gafeteEnviar = reporto;
                    for (var i = 0; i < 2; i++) {
                        funcion.buscarCorreo(gafeteEnviar, function (data) {

                            to = data;
                            cc = '';
                            subject = 'Orden Utra: ' + id_orden + ' -Cerrada-';
                            status = 'Cerrada';
                            color = '#0e943b';
                            id_orden = id_orden;
                            creador = nombrereporto;
                            gafete = reporto;
                            maquina = nombremaquina;
                            descripcion = descripcion;
                            fecha = ordenFecha;
                            clave = clave_cierre;
                            empleadoAtendida = usuarioAtendida;
                            fechaAtendida = fechaAtendida;
                            accionAtendida = accionAtendidaC;
                            empleadoCerrada = nombreEmpleado;
                            fechaCerrada = formatted_current_date;
                            accionCerrada = actividades;

                            dataEmail = {
                                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, clave, empleadoAtendida,
                                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                            }

                            funcion.sendEmail(dataEmail);
                        })

                        gafeteEnviar = numeroEmpleado;
                    }

                }
            });

        });
    })
};

//POST a historial apra generar tabla, primero revisa si el gafete existe
controller.historial_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    db.query(`SELECT COUNT( * ) AS count FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, count, fields) {

        db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
                WHERE (ordenes.departamento = departamento.id_departamento) 
                AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) AND (ordenes.reporto ="${numeroEmpleado}") ORDER BY id_orden DESC `, function (err, result, fields) {
                if (err) throw err;

                db.query(`SELECT COUNT(*) AS abiertas FROM ordenes WHERE status ="Abierta" AND reporto ="${numeroEmpleado}"`, function (err, result2, fields) {
                    if (err) throw err;


                    db.query(`SELECT COUNT(*) AS atendidas FROM ordenes WHERE status ="Atendida" AND reporto ="${numeroEmpleado}"`, function (err, result3, fields) {
                        if (err) throw err;


                        db.query(`SELECT COUNT(*) AS cerradas FROM ordenes WHERE status ="Cerrada" AND reporto ="${numeroEmpleado}"`, function (err, result4, fields) {
                            if (err) throw err;

                            ordenesAbiertas = result2[0].abiertas
                            ordenesAtendidas = result3[0].atendidas
                            ordenesCerradas = result4[0].cerradas


                            res.render('historial.ejs', {
                                data: result, data2: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas }, data3: numeroEmpleado
                            });
                        });
                    });
                });
            });
    });
};

//POST A revisar orden
controller.revisar_POST = (req, res) => {
    id_orden = req.params.id


    db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
      WHERE (ordenes.departamento = departamento.id_departamento) 
      AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) AND ordenes.id_orden = "${id_orden}"`, function (err, result, fields) {
            if (err) throw err;

            nombreEmpleado = result[0].usuario_dominio;
            numeroEmpleado = result[0].reporto;
            parteAfectada = result[0].componente;
            descripcionProblema = result[0].descripcion_problema;
            creacionFecha = result[0].fecha_hora; //Fecha sin formato
            departamento = result[0].nombre;
            nombrEncargado = result[0].usuario_atendida;
            nombreCierre = result[0].usuario_cierre;
            atendidaFecha = result[0].fecha_hora_atendida;
            cierreFecha = result[0].fecha_hora_cierre;
            accionAtendida = result[0].acciones_atendida;
            accionCierre = result[0].acciones_cierre;
            clave_cierre = result[0].clave;
            ordenStatus = result[0].status

            res.render('revisar.ejs', {
                data: { id_orden, descripcionProblema, accionAtendida, accionCierre, nombreEmpleado, departamento, numeroEmpleado, creacionFecha, cierreFecha, clave_cierre, parteAfectada, nombrEncargado, nombreCierre, atendidaFecha, ordenStatus }
            });
        });
};

// Dashboard GET
controller.dashboard_GET = (req, res) => {
    res.render('dashboard.ejs')
}


controller.dashboard_POST = (req, res) => {


    selectedMonth = req.body.month_selected
    selectedYear = req.body.year_selected
    selectedDepartment = req.body.department_selected

    db.query(`SELECT COUNT(*) AS abiertas FROM ordenes  WHERE MONTH(fecha_hora) = ${selectedMonth} AND  YEAR(fecha_hora) = ${selectedYear} AND departamento = ${selectedDepartment} AND status ="Abierta" `, function (err, result2, fields) {
        if (err) throw err;
        db.query(`SELECT COUNT(*) AS atendidas FROM ordenes  WHERE MONTH(fecha_hora) = ${selectedMonth} AND  YEAR(fecha_hora) = ${selectedYear} AND departamento = ${selectedDepartment} AND status ="Atendida"`, function (err, result3, fields) {
            if (err) throw err;
            db.query(`SELECT COUNT(*) AS cerradas FROM ordenes  WHERE MONTH(fecha_hora) = ${selectedMonth} AND  YEAR(fecha_hora) = ${selectedYear} AND departamento = ${selectedDepartment} AND status ="Cerrada"`, function (err, result4, fields) {
                if (err) throw err;
                db.query(`SELECT nombre FROM departamento WHERE id_departamento = ${selectedDepartment} `, function (err, result5, fields) {
                    if (err) throw err;
                    db.query(`
                SELECT COUNT(id_orden) AS parte_afectada_count, maquinas.nombre as maquina, departamento.nombre as departamento , ordenes.tiempo_muerto
                FROM otplus.ordenes, otplus.maquinas, otplus.departamento 
                WHERE ordenes.maquina = maquinas.id_maquina 
                AND ordenes.departamento = departamento.id_departamento 
                AND MONTH(ordenes.fecha_hora) = ${selectedMonth}  
                AND YEAR(ordenes.fecha_hora) = ${selectedYear} 
                AND departamento.id_departamento = "${selectedDepartment}"
                GROUP by ordenes.maquina
                `,
                        function (err, result6, fields) {
                            if (err) throw err;


                            ordenesAbiertas = result2[0].abiertas
                            ordenesAtendidas = result3[0].atendidas
                            ordenesCerradas = result4[0].cerradas
                            ordenesDepartamento = result5[0].nombre
                            ordenesSeleccion = result6

                            res.render('dashboard_view.ejs', {
                                data: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas, ordenesDepartamento, ordenesSeleccion, selectedMonth, selectedYear }
                            });
                        });
                });
            });
        });
    });
};




module.exports = controller;