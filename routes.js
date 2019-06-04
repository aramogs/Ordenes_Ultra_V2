const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/ordenesultra', routesController.index_GET);
router.get('/ordenesultra/login/:id', routesController.login);
router.get('/ordenesultra/crear_orden/login', routesController.crear_orden_GET);
router.post('/ordenesultra/crear_orden', routesController.crear_orden_POST);
router.post('/ordenesultra/crear_orden2', routesController.crear_orden2_POST);
router.post('/ordenesultra/guardar_orden', routesController.guardar_orden_POST);
router.get('/ordenesultra/ordenes', routesController.ordenes_GET);
router.post('/ordenesultra/cerrar_orden', routesController.cerrar_orden_POST);
router.post('/ordenesultra/cerrar_orden2', routesController.cerrar_orden2_POST);
router.post('/ordenesultra/cambio_orden/:id', routesController.cambio_orden_POST);
router.post('/ordenesultra/historial', routesController.historial_POST);
router.post('/ordenesultra/revisar/:id', routesController.revisar_POST);
router.get('/ordenesultra/dashboard', routesController.dashboard_GET);
router.post('/ordenesultra/dashboard_view', routesController.dashboard_POST);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;