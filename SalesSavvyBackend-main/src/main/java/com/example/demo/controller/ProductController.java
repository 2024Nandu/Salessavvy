
package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.entity.User;
import com.example.demo.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(
        origins = {
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175"
        },
        allowCredentials = "true"
)
@RequestMapping("/api/products")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getProducts(
            @RequestParam(required = false) String category,
            HttpServletRequest request) {

        try {
            // Get the authenticated user from the authentication filter
            User authenticatedUser =
                    (User) request.getAttribute("authenticatedUser");

            if (authenticatedUser == null) {
                return ResponseEntity.status(401)
                        .body(Map.of("error", "Unauthorized access"));
            }

            // Fetch products, optionally filtered by category
            List<Product> products =
                    productService.getProductsByCategory(category);

            Map<String, Object> response = new HashMap<>();

            // Add authenticated user information
            Map<String, String> userInfo = new HashMap<>();
            userInfo.put("name", authenticatedUser.getUsername());
            userInfo.put("role", authenticatedUser.getRole().name());

            response.put("user", userInfo);

            // Add product details
            List<Map<String, Object>> productList = new ArrayList<>();

            for (Product product : products) {
                Map<String, Object> productDetails = new HashMap<>();

                productDetails.put("product_id", product.getProductId());
                productDetails.put("name", product.getName());
                productDetails.put("description", product.getDescription());
                productDetails.put("price", product.getPrice());
                productDetails.put("stock", product.getStock());

                // Fetch images associated with this product
                List<String> images =
                        productService.getProductImages(product.getProductId());

                productDetails.put("images", images);

                productList.add(productDetails);
            }

            response.put("products", productList);

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage() != null
                                    ? e.getMessage()
                                    : "Unable to fetch products"
                    ));
        }
    }
}
