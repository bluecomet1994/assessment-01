import * as express from 'express';
import PhotoController from '../controllers/PhotoController';

const router: express.Router = express.Router();

router.get('/photos/:id', PhotoController.getById);
router.get('/photos', PhotoController.filter);

export default router;
