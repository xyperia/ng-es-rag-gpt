// chat.service.ts
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor() {}

  // Send message and return an EventSource object for streaming responses
  sendMessage(message: string): EventSource {
    const url = `${environment.ragUrl}/chat?question=${encodeURIComponent(message)}`;
    return new EventSource(url); // Return the EventSource instance
  }
}