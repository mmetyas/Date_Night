
package com.datenight.backend.dto;

public class InvitationResponseRequest {

    private String status;
    private String restaurantName;

    public InvitationResponseRequest() {
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRestaurantName() {
        return restaurantName;
    }

    public void setRestaurantName(String restaurantName) {
        this.restaurantName = restaurantName;
    }
}
