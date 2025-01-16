import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-admin-messages',
  templateUrl: './admin-messages.component.html',
  styleUrls: ['./admin-messages.component.css'],
})
export class AdminMessagesComponent implements OnInit {
  clients: any[] = [];
  selectedClient: any = null;
  messages: any[] = [];
  newMessage: string = '';
  adminId: number = 1; // Assuming admin ID is 1

  constructor(
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadClients();
  }

  loadClients() {
    // Get unique clients who have messaged the admin
    this.messageService.getMessagesForAdmin(this.adminId).subscribe(messages => {
      const uniqueClients = new Map();
      messages.forEach((msg: { sender: { role: string; id: any; }; }) => {
        if (msg.sender.role === 'CLIENT') {
          uniqueClients.set(msg.sender.id, msg.sender);
        }
      });
      this.clients = Array.from(uniqueClients.values());
    });
  }

  selectClient(client: any) {
    this.selectedClient = client;
    this.loadClientConversation();
  }

  loadClientConversation() {
    if (this.selectedClient) {
      this.messageService.getConversation(this.adminId, this.selectedClient.id)
        .subscribe(messages => {
          this.messages = messages.sort((a: any, b: any) => 
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          );
        });
    }
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.selectedClient) return;

    this.messageService.sendMessage(this.adminId, this.selectedClient.id, this.newMessage)
      .subscribe(() => {
        this.newMessage = '';
        this.loadClientConversation();
      });
  }
}