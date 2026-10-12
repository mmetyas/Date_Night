
package com.datenight.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class DateNightController {

    @GetMapping("/api/date-night/hello")
    public String sayHello() {
        return "Welcome to Date Night!";
    }
}
