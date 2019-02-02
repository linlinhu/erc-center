package com.emin.platform.ec;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.cloud.netflix.feign.EnableFeignClients;

import com.emin.platform.ec.config.WebMvcConfig;


@SpringBootApplication
@EnableDiscoveryClient
@EnableFeignClients 
public class Application {
	public static void main(String[] args) {
		SpringApplication.run(new Object[]{Application.class,WebMvcConfig.class}, args);
	}
}

