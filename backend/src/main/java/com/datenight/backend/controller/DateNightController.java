
package com.datenight.backend.controller;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.service.DateInvitationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
