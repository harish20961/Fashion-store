package com.fashionstore.config;

import com.fashionstore.model.Product;
import com.fashionstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            // Sample Products
            productRepository.save(new Product(
                "Classic White T-Shirt",
                "Premium cotton t-shirt with a comfortable fit. Perfect for everyday wear.",
                "CLOTHES",
                new BigDecimal("29.99"),
                50,
                "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"
            ));
            
            productRepository.save(new Product(
                "Slim Fit Jeans",
                "Modern slim fit jeans made from high-quality denim. Stylish and comfortable.",
                "CLOTHES",
                new BigDecimal("59.99"),
                30,
                "https://images.unsplash.com/photo-1542272604-787c3835535d?w=500"
            ));
            
            productRepository.save(new Product(
                "Running Sneakers",
                "Lightweight running sneakers with excellent cushioning for maximum comfort.",
                "SHOES",
                new BigDecimal("89.99"),
                25,
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"
            ));
            
            productRepository.save(new Product(
                "Leather Oxford Shoes",
                "Classic leather oxford shoes perfect for formal occasions.",
                "SHOES",
                new BigDecimal("129.99"),
                20,
                "https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=500"
            ));
            
            productRepository.save(new Product(
                "Designer Watch",
                "Elegant designer watch with a stainless steel band.",
                "ACCESSORIES",
                new BigDecimal("199.99"),
                15,
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
            ));
            
            productRepository.save(new Product(
                "Leather Belt",
                "Premium leather belt with a classic buckle design.",
                "ACCESSORIES",
                new BigDecimal("39.99"),
                40,
                "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500"
            ));
            
            productRepository.save(new Product(
                "Summer Dress",
                "Beautiful floral summer dress perfect for warm weather.",
                "CLOTHES",
                new BigDecimal("79.99"),
                35,
                "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500"
            ));
            
            productRepository.save(new Product(
                "Canvas Sneakers",
                "Casual canvas sneakers with a comfortable fit for everyday wear.",
                "SHOES",
                new BigDecimal("49.99"),
                45,
                "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=500"
            ));
            
            System.out.println("Sample products initialized successfully!");
        }
    }
}
