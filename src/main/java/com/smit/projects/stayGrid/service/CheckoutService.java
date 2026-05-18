package com.smit.projects.stayGrid.service;

import com.smit.projects.stayGrid.entity.Booking;

public interface CheckoutService {

    String getCheckoutSession(Booking booking, String successUrl, String cancelUrl);

}
