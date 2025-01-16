import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  private apiUrl = 'http://localhost:8081/api/messages';

  constructor(private http: HttpClient) {}

  sendMessage(senderId: number, receiverId: number, content: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, null, {
      params: { senderId, receiverId, content },
    });
  }

  getConversation(senderId: number, receiverId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/conversation`, {
      params: { senderId, receiverId },
    });
  }

  getMessagesForAdmin(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin`, {
      params: { adminId },
    });
  }

  getClientsForAdmin(adminId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/clients`, {
      params: { adminId },
    });
  }
}