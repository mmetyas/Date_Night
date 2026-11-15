
package com.datenight.backend.repository;

import com.datenight.backend.entity.DateInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DateInvitationRepository
        extends JpaRepository<DateInvitation, Long> {

    Optional<DateInvitation> findByInvitationToken(String token);
}
