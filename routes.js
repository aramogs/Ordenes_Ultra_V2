const express = require('express');
const router = express.Router();
const db = require('./public/db/conn');

//Routes

router.get('/', (req, res) => {
  res.render('index.ejs');
});


router.get('/login/:id', (req, res) => {
  loginId = req.params.id
  res.render('login.ejs', {
    data: loginId
  });
});


router.get('/crear_orden/login', (req, res) => {
  res.render('login.ejs');
});


router.post("/crear_orden", (req, res) => {
  numeroEmpleado = req.body.user;

  db.query(`SELECT COUNT( * ) AS count FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, count, fields) {
    if (err) {
      res.redirect('/login/crear_orden')
    }else{
      
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
});



router.post('/crear_orden2', (req, res) => {
  departamento = (req.body.departamento);
  maquina = (req.body.maquina)
  nombreEmpleado = (req.body.empleado)
  numeroEmpleado = (req.body.gafete)
  db.query(`SELECT * FROM areas_componentes_afectados WHERE familia_maquina = '${maquina}'`, (err, result3, fields) => {
    if (err) throw err;

    res.render('crear_orden2.ejs', {
      data: departamento, data2: maquina, data3: result3, data4: nombreEmpleado, data5: numeroEmpleado
    });
  });
});


router.post('/guardar_orden', (req, res) => {
  empleado = (req.body.empleado)
  gafete = (req.body.gafete)
  departamento = (req.body.departamento)
  maquina = (req.body.maquina)
  turno = (req.body.turno)
  grupo = (req.body.grupo)
  descripcion = (req.body.descripcion)
  archivo = (req.body.archivo)
  clave = Math.floor(Math.random() * 10000);

  db.query(`SELECT id_maquina FROM maquinas WHERE nombre ='${maquina}'`, function (err, result1, fields) {
    if (err) throw err;

    db.query(`SELECT id_departamento FROM departamento WHERE nombre='${departamento}'`, function (err, result2, fields) {
      if (err) throw err;

      db.query(`INSERT INTO ordenes (departamento, maquina, parte_afectada, descripcion_problema, 
      reporto, usuario_dominio, email, turno, grupo,  fecha_hora, clave, status, tipo_orden)
      VALUES( '${result2[0].id_departamento}', '${result1[0].id_maquina}', '157', '${descripcion}', 
      '${gafete}', '${empleado}', '${empleado + '@tristone.com'}', '${turno}', '${grupo}', NOW() , '${clave}', 
      'Abierta', 'Correctivo')`, (err, result, fields) => {
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
});


router.get('/ordenes', (req, res) => {
  db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
    WHERE (ordenes.departamento = departamento.id_departamento) 
    AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) ORDER BY id_orden DESC`, function (err, result2, fields) {
      if (err) throw err;
      res.render('ordenes.ejs', {
        data: result2
      });
    });
});


router.post("/cerrar_orden", (req, res) => {
  numeroEmpleado = req.body.user;

    db.query(`SELECT COUNT( * ) AS count FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, count, fields) {         
      if (err) {
        res.redirect('/login/cerrar_orden')
      }else{
  
      if(count[0].count==0){
        res.redirect('/login/cerrar_orden')
      }else{

        db.query(`SELECT Nombre FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, result3, fields) {
          if (err) throw err;

          nombreEmpleado = result3[0].Nombre;

          res.render('cerrar_orden.ejs', {
            data: numeroEmpleado, data2: nombreEmpleado
          });
        });
      }
    }
  });
});



router.post("/cerrar_orden2", (req, res) => {

  numeroEmpleado = req.body.numeroEmpleado;
  nombreEmpleado = req.body.nombreEmpleado;
  id_orden = req.body.id_orden;

  db.query(`SELECT * FROM ordenes,areas_componentes_afectados 
              WHERE ordenes.id_orden = ${id_orden}
              AND ordenes.parte_afectada = areas_componentes_afectados.id_componente`, function (err, result1, fields) {

      parteAfectada = result1[0].componente
      res.render('cerrar_orden2.ejs', {
        data: { numeroEmpleado, nombreEmpleado, id_orden, parteAfectada }
      });
    });
});


router.post('/cambio_orden/:id', (req, res) => {
  accionTomada = req.params.id;
  nombreEmpleado = req.body.nombreEmpleado;
  numeroEmpleado = req.body.numeroEmpleado;
  id_orden = req.body.id_orden;
  current_date = req.body.current_date; //Fecha sin formato
  formatted_current_date = req.body.formatted_current_date; //Fecha con formato YYYY-MM-DD hh:mm:ss
  clave_cierre = req.body.clave_cierre;
  parteAfectada = req.body.parteAfectada;
  actividades = req.body.actividades;
  

  db.query(`SELECT * FROM ordenes WHERE id_orden = ${id_orden}`,function (err,result,fields){

    ordenFecha = result[0].fecha_hora;
    var startDate = new Date(ordenFecha);//Fecha en que se creo la orden de trabajo
    var endDate   = new Date(current_date);//Fecha en la que se esta tendiendo la orden de trabajo, viene de cerrar_orden2(current_date)
    var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
    
  if (accionTomada == "atendida") {
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

  }
})
});

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;