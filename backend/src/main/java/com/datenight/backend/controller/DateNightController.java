
package com.datenight.backend.controller;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.service.DateInvitationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/date-night")
@CrossOrigin(origins = "http://localhost:5173")
public class DateNightController {

    private final DateInvitationService dateInvitationService;

    public DateNightController(DateInvitationService dateInvitationService) {
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
}
