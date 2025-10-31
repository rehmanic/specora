import { EventEmitter } from 'events';

class EventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50); // Increase max listeners for multiple subscribers
  }

  // Emit event with error handling
  emitSafe(event, data) {
    try {
      this.emit(event, data);
      console.log(`📡 Event emitted: ${event}`, data?.id || '');
    } catch (error) {
      console.error(`Error emitting event ${event}:`, error);
    }
  }

  // Subscribe with error handling wrapper
  onSafe(event, handler) {
    const wrappedHandler = async (...args) => {
      try {
        await handler(...args);
      } catch (error) {
        console.error(`Error in handler for ${event}:`, error);
      }
    };
    this.on(event, wrappedHandler);
  }
}

const eventBus = new EventBus();

export default eventBus;
