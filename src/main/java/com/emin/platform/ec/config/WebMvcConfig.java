package com.emin.platform.ec.config;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.springframework.web.servlet.view.freemarker.FreeMarkerViewResolver;

import com.emin.platform.ec.filter.UserFilter;
import com.emin.platform.ec.interfaces.PersonApiFeign;
import com.emin.platform.ec.util.ECMThreadLocalUtil;

import feign.Feign;
import freemarker.template.TemplateExceptionHandler;

@Configurable
@EnableWebMvc
public class WebMvcConfig extends WebMvcConfigurerAdapter{

	@Autowired
	PersonApiFeign personApiFeign;
	
	@Override
	public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
		
        configurer.favorPathExtension(false);
    }
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
	    registry.addResourceHandler("/js/**")
	            .addResourceLocations("classpath:/static/js/");
	    registry.addResourceHandler("/css/**")
	    		.addResourceLocations("classpath:/static/css/");
	    registry.addResourceHandler("/img/**")
				.addResourceLocations("classpath:/static/img/");
	    registry.addResourceHandler("/fonts/**")
				.addResourceLocations("classpath:/static/fonts/");
	    
	    
	}
	
	@Override
    public void addInterceptors(InterceptorRegistry registry) {
		registry.addInterceptor(new UserFilter(personApiFeign)).addPathPatterns("/**").excludePathPatterns("/login","/getValidImg","/loginIn", "/");
	}
	@Bean
	public Object2JSONTag object2JSONTag() {
		return new Object2JSONTag();
	}
	
	@Bean
    public OperationValidationTag operationValidationTag() {
        return new OperationValidationTag();
    }
	
	@Bean
	public CommandLineRunner customFreemarker(FreeMarkerViewResolver resolver) {
		return new CommandLineRunner() {
			@Autowired
			private freemarker.template.Configuration configuration;

			@Override
			public void run(String... strings) throws Exception {
				configuration.setLogTemplateExceptions(false);
				configuration.setTemplateExceptionHandler(TemplateExceptionHandler.IGNORE_HANDLER);
				configuration.setNumberFormat("#");
				configuration.setSharedVariable("obj2json", object2JSONTag());
				configuration.setSharedVariable("codeValidation", operationValidationTag());
				resolver.setViewClass(CustomFreeMarkerView.class);
			}
		};
	}
	
	@Bean
	public Feign.Builder feignBuilder(){
		return Feign.builder().requestInterceptor(template ->
		{
				template.header("ecmId", ECMThreadLocalUtil.getEcmId() != null ? ECMThreadLocalUtil.getEcmId().toString() : "");
				template.header("ecmName", ECMThreadLocalUtil.getEcmName() != null ? ECMThreadLocalUtil.getEcmName() : "");
		}
		);
	}
	
}
