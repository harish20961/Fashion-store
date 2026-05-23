package com.fashionstore.service;

import com.fashionstore.model.Order;
import com.fashionstore.model.OrderItem;
import com.fashionstore.model.Product;
import com.fashionstore.repository.OrderRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import org.springframework.lang.NonNull;

@Service
@Transactional
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductService productService;
    
    @Value("${stripe.secret.key}")
    private String stripeSecretKey;
    
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }
    
    public List<Order> getOrdersByEmail(String email) {
        return orderRepository.findByCustomerEmail(email);
    }
    
    public Order getOrderById(@NonNull Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + id));
    }
    
    public Order createOrder(Order order, List<Map<String, Object>> items) {
        // Calculate total and create order items
        BigDecimal total = BigDecimal.ZERO;
        for (Map<String, Object> item : items) {
            Long productId = Long.valueOf(item.get("productId").toString());
            Integer quantity = Integer.valueOf(item.get("quantity").toString());
            
            Product product = productService.getProductById(productId);
            if (product.getStock() < quantity) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(quantity));
            total = total.add(itemTotal);
            
            OrderItem orderItem = new OrderItem(product, quantity, product.getPrice());
            order.addOrderItem(orderItem);
            
            // Update stock
            productService.updateStock(productId, quantity);
        }
        
        order.setTotalAmount(total);
        return orderRepository.save(order);
    }
    
    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);
        order.setStatus(status);
        return orderRepository.save(order);
    }
    
    // Stripe Payment Integration
    public PaymentIntent createPaymentIntent(BigDecimal amount, String currency) throws StripeException {
        long amountInCents = amount.multiply(BigDecimal.valueOf(100)).longValue();
        
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInCents)
                .setCurrency(currency.toLowerCase())
                .addPaymentMethodType("card")
                .build();
        
        return PaymentIntent.create(params);
    }
    
    public Order processPayment(Long orderId, String paymentIntentId) {
        Order order = getOrderById(orderId);
        order.setStripePaymentIntentId(paymentIntentId);
        order.setStatus("PAID");
        return orderRepository.save(order);
    }
    
    // Automation API - Webhook simulation
    public void processOrderAutomation(Long orderId) {
        Order order = getOrderById(orderId);
        
        // Simulate automated order processing
        if ("PAID".equals(order.getStatus())) {
            // Update to shipped
            order.setStatus("SHIPPED");
            orderRepository.save(order);
            
            // Here you would trigger external services:
            // - Send confirmation email
            // - Notify warehouse
            // - Update inventory system
            // - Trigger shipping API
        }
    }
}
