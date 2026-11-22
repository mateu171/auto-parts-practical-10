import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable, interval, map } from 'rxjs';
import { Public } from '../auth/decorators/public.decorator';
import { EventsGateway } from './events.gateway';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly eventsGateway: EventsGateway) {}

  /**
   * SSE-потік системних показників кожні 5 секунд.
   * Ендпоінт публічний, бо браузерний EventSource не вміє передавати
   * заголовок Authorization; дані потоку не містять чутливої інформації.
   */
  @Public()
  @Sse('events/stream')
  stream(): Observable<MessageEvent> {
    return interval(5000).pipe(
      map((tick) => ({
        id: String(tick),
        data: {
          tick,
          status: 'OK',
          serverTime: new Date().toISOString(),
          uptimeSeconds: Math.round(process.uptime()),
          activeConnections: this.eventsGateway.getActiveConnections(),
        },
      })),
    );
  }
}
