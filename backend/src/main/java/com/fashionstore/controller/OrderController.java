package com.fashionstore.controller;

import com.fashionstore.model.Order;
import com.fashionstore.service.OrderService;
import com.stripe.model.PaymentIntent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "${cors.allowed.origins}")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }
    
    @GetMapping("/email/{email}")
    public ResponseEntity<List<Order>> getOrdersByEmail(@PathVariable String email) {
        return ResponseEntity.ok(orderService.getOrdersByEmail(email));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Map<String, Object> request) {
        Order order = new Order();
        order.setCustomerName((String) request.get("customerName"));
        order.setCustomerEmail((String) request.get("customerEmail"));
        order.setShippingAddress((String) request.get("shippingAddress"));
        order.setPaymentMethod((String) request.get("paymentMethod"));
        
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> items = (List<Map<String, Object>>) request.get("items");
        
        return ResponseEntity.ok(orderService.createOrder(order, items));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, request.get("status")));
    }
    
    @PostMapping("/payment/create-intent")
    public ResponseEntity<Map<String, String>> createPaymentIntent(@RequestBody Map<String, Object> request) {
        try {
            java.math.BigDecimal amount = new java.math.BigDecimal(request.get("amount").toString());
            String currency = (String) request.get("currency");
            
            PaymentIntent paymentIntent = orderService.createPaymentIntent(amount, currency);
            
            return ResponseEntity.ok(Map.of(
                "clientSecret", paymentIntent.getClientSecret(),
                "paymentIntentId", paymentIntent.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @PostMapping("/{orderId}/payment/confirm")
    public ResponseEntity<Order> confirmPayment(@PathVariable Long orderId, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(orderService.processPayment(orderId, request.get("paymentIntentId")));
    }
    
    // Automation API Endpoint
    @PostMapping("/{orderId}/automation/process")
    public ResponseEntity<Order> processOrderAutomation(@PathVariable Long orderId) {
        orderService.processOrderAutomation(orderId);
        return ResponseEntity.ok(orderService.getOrderById(orderId));
    }
}
