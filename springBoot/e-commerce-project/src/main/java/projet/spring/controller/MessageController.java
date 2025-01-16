package projet.spring.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import projet.spring.entities.Message;
import projet.spring.entities.User;
import projet.spring.service.MessageService;
import projet.spring.service.UserService;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:4200")
public class MessageController {

    @Autowired
    private MessageService messageService;

    @Autowired
    private UserService userService;

    // Envoyer un message
    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam Long senderId,
            @RequestParam Long receiverId,
            @RequestParam String content) {
        User sender = userService.findById(senderId)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User receiver = userService.findById(receiverId)
                .orElseThrow(() -> new RuntimeException("Receiver not found"));
        Message message = messageService.sendMessage(sender, receiver, content);
        return ResponseEntity.ok(message);
    }

    // Récupérer la conversation entre deux utilisateurs
    @GetMapping("/conversation")
    public ResponseEntity<List<Message>> getConversation(
            @RequestParam Long senderId,
            @RequestParam Long receiverId) {
        List<Message> messages = messageService.getConversation(senderId, receiverId);
        return ResponseEntity.ok(messages);
    }

    // Récupérer les messages pour l'admin
    @GetMapping("/admin")
    public ResponseEntity<List<Message>> getMessagesForAdmin(@RequestParam Long adminId) {
        List<Message> messages = messageService.getMessagesForAdmin(adminId);
        return ResponseEntity.ok(messages);
    }

    // Récupérer la liste des clients ayant envoyé des messages à l'admin
    @GetMapping("/clients")
    public ResponseEntity<List<User>> getClientsForAdmin(@RequestParam Long adminId) {
        List<Message> messages = messageService.getMessagesForAdmin(adminId);
        List<User> clients = messages.stream()
                .filter(msg -> msg.getSender().getRole().equals("CLIENT"))
                .map(Message::getSender)
                .distinct()
                .collect(Collectors.toList());
        return ResponseEntity.ok(clients);
    }
}