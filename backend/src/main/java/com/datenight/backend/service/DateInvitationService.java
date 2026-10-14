
package com.datenight.backend.service;

import com.datenight.backend.dto.CreateInvitationRequest;
import com.datenight.backend.entity.DateInvitation;
import com.datenight.backend.repository.DateInvitationRepository;
import org.springframework.stereotype.Service;

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
}
