
package com.fashionstore.service;
 import org.springframework.lang.NonNull;

import com.fashionstore.model.Product;
import com.fashionstore.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@Service
@Transactional

public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    
    public List<Product> getAvailableProducts() {
        return productRepository.findByAvailableTrue();
    }
    
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryAndAvailableTrue(category);
    }
    
    public Product getProductById(@NonNull Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + id));
    }
    
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(@NonNull Long id, @NonNullProduct productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setCategory(productDetails.getCategory());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setImageUrl(productDetails.getImageUrl());
        product.setAvailable(productDetails.getAvailable());
        return productRepository.save(product);
    }
    
    public void deleteProduct(@NonNull Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
    
    public Product updateStock(@NonNull Long id, Integer quantity) {
        Product product = getProductById(id);
        product.setStock(product.getStock() - quantity);
        if (product.getStock() <= 0) {
            product.setAvailable(false);
        }
        return productRepository.save(product);
    }
}

