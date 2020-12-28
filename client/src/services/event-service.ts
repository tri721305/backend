import { Event } from '../models/event';
import { ApiService } from './api-service';

const SERVER_URL = 'http://localhost:3000/api';

export class EventService extends ApiService {
  getEventList(requestBody: any): any {
    return this.perform('POST', `${SERVER_URL}/event`, requestBody, null, null);
  }

  createTripEvent(requestBody: Event): any {
    return this.perform('POST', `${SERVER_URL}/event/create`, requestBody, null, null);
  }

  updateTripEvent(requestBody: Event): any {
    return this.perform('PUT', `${SERVER_URL}/event/update`, requestBody, null, null);
  }

  deleteTripEvent(tripEventId: number): any {
    return this.perform('DELETE', `${SERVER_URL}/event/${tripEventId}`, null, null, null);
  }
}
