import { EventEmitter } from "events";

class AppEventEmitter extends EventEmitter {}

/**
 * Application-wide event bus for decoupled cross-module communication.
 * Listeners are registered at startup in notification.service.ts.
 */
export const appEvents = new AppEventEmitter();
