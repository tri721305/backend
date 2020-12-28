import * as express from 'express';
import { TripDayController } from '../controllers/trip-day-controller';
import { checkTripDayOwnerByUrl, checkTripDayOwnerByPayload } from '../services/authentication-service';

const router = express.Router();
const tripDayController = new TripDayController();

/* Create trip day */
router.post('/day/create', checkTripDayOwnerByPayload, tripDayController.create);

/* Update trip day */
router.put('/day/update', checkTripDayOwnerByPayload, tripDayController.update);

/* Delete trip day */
router.delete('/day/:trip_day_id', checkTripDayOwnerByUrl, tripDayController.delete);

export = router;
