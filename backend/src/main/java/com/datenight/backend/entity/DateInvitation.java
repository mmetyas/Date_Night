
package com.datenight.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "date_invitations")
public class DateInvitation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String restaurantName;

    private LocalDate selectedDate;

    @Column(unique = true, nullable = false)
    private String invitationToken;

    private String status;

    private String respondedRestaurant;

    private LocalDateTime respondedAt;

    public DateInvitation() {
    }

    public DateInvitation(String restaurantName, LocalDate selectedDate) {
        this.restaurantName = restaurantName;
        this.selectedDate = selectedDate;
        this.invitationToken = UUID.randomUUID().toString();
        this.status = "PENDING";
    }

    public Long getId() {
        return id;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }

    public LocalDate getSelectedDate() {
        return selectedDate;
    }

    public void setSelectedDate(LocalDate selectedDate) {
        this.selectedDate = selectedDate;
    }

    public String getInvitationToken() {
        return invitationToken;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRespondedRestaurant() {
        return respondedRestaurant;
    }

    public void setRespondedRestaurant(String respondedRestaurant) {
        this.respondedRestaurant = respondedRestaurant;
    }

    public LocalDateTime getRespondedAt() {
        return respondedAt;
    }

    public void setRespondedAt(LocalDateTime respondedAt) {
        this.respondedAt = respondedAt;
    }
}
