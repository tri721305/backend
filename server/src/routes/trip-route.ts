import * as express from 'express';
import { TripController } from '../controllers/trip-controller';
import { checkTripOwnerByUrl } from '../services/authentication-service';

const router = express.Router();
const tripController = new TripController();

/* Retrieve trip list */
router.post('', tripController.retrieve);

/* Retrieve trip detail including trip day and trip event */
router.get('/:trip_id', checkTripOwnerByUrl, tripController.retrieveDetail);

/* Create trip */
router.post('/create', tripController.create);

/* Update trip */
router.put('/update', tripController.update);

export = router;
