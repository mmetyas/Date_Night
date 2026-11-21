
package com.datenight.backend.service;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.dto.InvitationResponseRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.repository.DateInvitationRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
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
        applyPersonalization(invitation, request);

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
        applyPersonalization(invitation, request);

        return dateInvitationRepository.save(invitation);
    }

    private void applyPersonalization(DateInvitation invitation,
                                      CreateInvitationRequest request) {
        invitation.setGuestName(clean(request.getGuestName(), 50));
        invitation.setPersonalMessage(clean(request.getPersonalMessage(), 500));
    }

    private static String clean(String value, int maxLength) {
        if (value == null || value.isBlank()) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.length() > maxLength
                ? trimmed.substring(0, maxLength)
                : trimmed;
    }

    // Get an invitation using its public token
    public DateInvitation getInvitationByToken(String token) {

        return dateInvitationRepository
                .findByInvitationToken(token)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Invitation not found"
                ));
    }

    // Save the wife's response
    public DateInvitation respondToInvitation(
            String token,
            InvitationResponseRequest request) {

        DateInvitation invitation = getInvitationByToken(token);

        if (!"PENDING".equals(invitation.getStatus())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "This invitation has already been answered"
            );
        }

        String status = request.getStatus();

        if (!"ACCEPTED".equals(status)
                && !"DECLINED".equals(status)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid invitation status"
            );
        }

        if ("ACCEPTED".equals(status)) {

            if (request.getRestaurantName() == null
                    || request.getRestaurantName().isBlank()) {
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Please select a restaurant"
                );
            }

            invitation.setRespondedRestaurant(
                    request.getRestaurantName()
            );

        } else {
            invitation.setRespondedRestaurant(null);
        }

        invitation.setStatus(status);
        invitation.setRespondedAt(LocalDateTime.now());

        return dateInvitationRepository.save(invitation);
    }
}
