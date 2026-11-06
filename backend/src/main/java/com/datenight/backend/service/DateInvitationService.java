
package com.datenight.backend.service;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.repository.DateInvitationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class DateInvitationService {

    private final DateInvitationRepository dateInvitationRepository;

    public DateInvitationService(
            DateInvitationRepository dateInvitationRepository) {
        this.dateInvitationRepository = dateInvitationRepository;
    }

    public DateInvitation createInvitation(
            CreateInvitationRequest request) {

        DateInvitation invitation = new DateInvitation(
                request.getRestaurantName(),
                request.getSelectedDate()
        );

        return dateInvitationRepository.save(invitation);
    }

    public List<DateInvitation> getAllInvitations() {
        return dateInvitationRepository.findAll();
    }

    public void deleteInvitation(Long invitationId) {

        DateInvitation invitation = dateInvitationRepository
                .findById(invitationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invitation not found"
                ));

        dateInvitationRepository.delete(invitation);
    }

    public DateInvitation updateInvitation(
            Long invitationId,
            CreateInvitationRequest request) {

        DateInvitation invitation = dateInvitationRepository
                .findById(invitationId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invitation not found"
                ));

        invitation.setRestaurantName(request.getRestaurantName());
        invitation.setSelectedDate(request.getSelectedDate());

        return dateInvitationRepository.save(invitation);
    }
}
