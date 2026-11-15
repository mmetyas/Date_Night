
package com.datenight.backend.controller;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.dto.InvitationResponseRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.service.DateInvitationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/date-night")
@CrossOrigin(origins = "http://localhost:5173")
public class DateNightController {

    private final DateInvitationService dateInvitationService;

    public DateNightController(
            DateInvitationService dateInvitationService) {
        this.dateInvitationService = dateInvitationService;
    }

    @GetMapping("/hello")
    public String sayHello() {
        return "Welcome to Date Night!";
    }

    @PostMapping("/invitations")
    public DateInvitation createInvitation(
            @RequestBody CreateInvitationRequest request) {

        return dateInvitationService.createInvitation(request);
    }

    @GetMapping("/invitations")
    public List<DateInvitation> getAllInvitations() {
        return dateInvitationService.getAllInvitations();
    }

    @DeleteMapping("/invitations/{invitationId}")
    public ResponseEntity<Void> deleteInvitation(
            @PathVariable Long invitationId) {

        dateInvitationService.deleteInvitation(invitationId);

        return ResponseEntity.noContent().build();
    }

    @PutMapping("/invitations/{invitationId}")
    public DateInvitation updateInvitation(
            @PathVariable Long invitationId,
            @RequestBody CreateInvitationRequest request) {

        return dateInvitationService.updateInvitation(
                invitationId,
                request
        );
    }

    // Public endpoint: Get invitation using token
    @GetMapping("/invitations/public/{token}")
    public DateInvitation getInvitationByToken(
            @PathVariable String token) {

        return dateInvitationService.getInvitationByToken(token);
    }

    // Public endpoint: Accept or decline invitation
    @PostMapping("/invitations/public/{token}/respond")
    public DateInvitation respondToInvitation(
            @PathVariable String token,
            @RequestBody InvitationResponseRequest request) {

        return dateInvitationService.respondToInvitation(
                token,
                request
        );
    }
}
