
package com.datenight.backend.dto;

import java.time.LocalDate;

public class CreateInvitationRequest {

    private String restaurantName;
    private LocalDate selectedDate;

    public CreateInvitationRequest() {
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
}
