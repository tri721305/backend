import * as express from 'express';
import { EventController } from '../controllers/event-controller';
import { checkEventOwnerByPayload, checkEventOwnerByUrl } from '../services/authentication-service';

const router = express.Router();
const eventController = new EventController();

/* Retrieve trip event list */
router.post('', eventController.retrieve);

/* Create trip event */
router.post('/create', checkEventOwnerByPayload, eventController.create);

/* Update trip event */
router.put('/update', checkEventOwnerByPayload, eventController.update);

/* Delete trip event */
router.delete('/:event_id', checkEventOwnerByUrl, eventController.delete);

export = router;
