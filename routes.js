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
  res.render('index.ejs')
}else{
  
if(count[0].count==0){
  res.render('index.ejs')
}
else{

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
            console.log(numeroEmpleado);

            db.query(`SELECT Nombre FROM empleados WHERE Gafete=${numeroEmpleado}`, function (err, result1, fields) {     
             nombreEmpleado = result1[0].Nombre;
              if (err) {res.render('login.ejs'); return;};
                console.log(nombreEmpleado)
          res.render('cerrar_orden.ejs', {
            data: numeroEmpleado, data2: nombreEmpleado
          });
        });
      });





router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;