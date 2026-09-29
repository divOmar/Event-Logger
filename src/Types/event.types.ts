import { Request } from "express";
import { Event } from "../Domain/events/event";


export interface CreateEventInput {
  eventType: string;
  source: string;
  payload: Record<string, unknown>;
}

export interface EventFilters {
  eventType?: string;
  source?: string;
}

export interface EventPagination {
  page: number;
  limit: number;
}

export interface EventResult {
  events: Event[];
  total: number;
}




export interface ValidatedRequest<T> extends Request {
    validatedQuery: T;
}









  export enum EventProcessingStatus {
  RECEIVED = "RECEIVED",
  PROCESSING = "PROCESSING",
  PROCESSED = "PROCESSED",
  FAILED = "FAILED"
}