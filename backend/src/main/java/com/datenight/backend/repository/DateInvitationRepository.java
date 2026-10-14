
package com.datenight.backend.repository;

import com.datenight.backend.entity.DateInvitation;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DateInvitationRepository
        extends JpaRepository<DateInvitation, Long> {
}
