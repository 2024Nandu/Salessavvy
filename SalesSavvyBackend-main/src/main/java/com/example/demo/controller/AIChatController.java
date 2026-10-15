package com.example.demo.controller;

import com.example.demo.dto.AIChatRequest;
import com.example.demo.dto.AIChatResponse;
import com.example.demo.service.AIShoppingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class AIChatController {

    private final AIShoppingService aiShoppingService;

    public AIChatController(AIShoppingService aiShoppingService) {
        this.aiShoppingService = aiShoppingService;
    }

    @PostMapping("/chat")
    public AIChatResponse chat(@RequestBody AIChatRequest request) {
        return new AIChatResponse(
                aiShoppingService.chat(request.message())
        );
    }
}