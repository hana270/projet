import { AfterViewChecked, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css'],
})
export class ChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messageContainer') private messageContainer!: ElementRef;
  
  messages: any[] = [];
  newMessage: string = '';
  userId: number;
  adminId: number = 1; // Admin ID
  isLoading: boolean = false;

  constructor(private messageService: MessageService) {
    this.userId = Number(localStorage.getItem('userId'));
  }

  ngOnInit() {
    this.loadMessages();
    // Set up polling for new messages
    setInterval(() => this.loadMessages(), 5000);
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadMessages() {
    this.messageService.getConversation(this.userId, this.adminId)
      .subscribe(messages => {
        this.messages = messages.sort((a: any, b: any) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    this.isLoading = true;

    this.messageService.sendMessage(this.userId, this.adminId, this.newMessage)
      .subscribe(() => {
        this.newMessage = '';
        this.loadMessages();
        this.isLoading = false;
      });
  }

  private scrollToBottom(): void {
    try {
      this.messageContainer.nativeElement.scrollTop = 
        this.messageContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
