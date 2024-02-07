    package com.ssafy.movezoo.auth.config;

    import com.ssafy.movezoo.auth.config.details.CustomOAuth2Service;
    import com.ssafy.movezoo.auth.config.details.CustomUserDetailsService;
    import jakarta.servlet.ServletException;
    import jakarta.servlet.http.HttpServletRequest;
    import jakarta.servlet.http.HttpServletResponse;
    import jakarta.servlet.http.HttpSession;
    import lombok.RequiredArgsConstructor;
    import lombok.extern.slf4j.Slf4j;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.Customizer;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.core.Authentication;
    import org.springframework.security.core.AuthenticationException;
    import org.springframework.security.core.userdetails.UserDetails;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.web.AuthenticationEntryPoint;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.access.AccessDeniedHandler;
    import org.springframework.security.web.authentication.AuthenticationFailureHandler;
    import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
    import org.springframework.security.web.savedrequest.HttpSessionRequestCache;

    import java.io.IOException;

    @Configuration
    @EnableWebSecurity  // security 활성화 후 기본 스프링 필터체인에 등록
    @RequiredArgsConstructor
    @Slf4j
    public class SecurityConfig {

        private final CustomUserDetailsService UserDetailsServcie;
        private final CustomOAuth2Service customOAuth2Service;

        AuthenticationEntryPoint authenticationEntryPoint;
        AccessDeniedHandler accessDeniedHandler;
        @Bean
        public BCryptPasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }

        @Bean
        protected SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
            HttpSessionRequestCache requestCache = new HttpSessionRequestCache();
            requestCache.setMatchingRequestParameterName(null);

            // 인증 관리
            http
                    .csrf((csrfConfig) -> csrfConfig.disable()) // Cross site request forgery 비활성화
    //                .headers((headerConfig) ->  // 보안 헤더를 구성하며, iframe에 임베딩을 허용하도록 프레임 옵션을 비활성화
    //                        headerConfig.frameOptions(frameOptionsConfig ->
    //                                frameOptionsConfig.disable()
    //                        )
    //                )

                    // 로그인 후 ?continue 가 붙는 것에 대한 해결
                    .requestCache((request) ->
                            request.requestCache(requestCache))

                    //  form 기반 로그인
                    .formLogin((formLogin) ->
                            formLogin
                                    .loginPage("/")  // GET, 사용자 정의 로그인 페이지   // 설정자체를 안해야지 default로 제공해주는 페이지로 연결됨
                                    .usernameParameter("userEmail") // 로그인 폼에서 사용자 이름 및 비밀번호 매개변수를 지정
                                    .passwordParameter("password")
                                    .loginProcessingUrl("/api/login")   // POST, 로그인 submit 처리 URL
//                                    .defaultSuccessUrl("/main", true)    // 로그인 성공 시 홈 페이지로 리디렉션
//                                    .failureUrl("/main")
                                    .successHandler(new AuthenticationSuccessHandler() {
                                        @Override
                                        public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
                                            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                                            log.info("로그인 성공 - 사용자명: {}", userDetails.getUsername());

                                            // 세션에 사용자 정보 저장
                                            HttpSession session = request.getSession();
                                            session.setAttribute("user", userDetails);

                                            UserDetails userDetails2 = (UserDetails)session.getAttribute("user");
                                            log.info("session get ", userDetails2.getUsername());
                                            

                                            // 성공 응답을 생성하거나 추가 작업 수행
                                            response.setStatus(HttpServletResponse.SC_OK);
                                        }
                                    })
                                    .failureHandler(new AuthenticationFailureHandler() {
                                        @Override
                                        public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response, AuthenticationException exception) throws IOException, ServletException {
                                            log.info("로그인 실패");
                                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                                        }
                                    })
                    )
                    .logout((logoutConfig) ->   // 로그아웃 처리 및 로그아웃 후 홈 페이지로 리디렉션
                            logoutConfig
                                    .logoutUrl("/api/logout")   // logout 처리 url
                                    .logoutSuccessUrl("/")
                                    .invalidateHttpSession(true)
                                    .deleteCookies("JSESSIONID")
                    )
                    .userDetailsService(UserDetailsServcie)
                            .oauth2Login(Customizer.withDefaults());

            // 인가 관리
            http
                .sessionManagement((session) ->
                        session
                                .maximumSessions(1) // 최대 허용 가능 세션 수 (-1: 무제한 세션 허용)
                                .maxSessionsPreventsLogin(true) // 동시 로그인 차단 (false: 기존 세션 만료, default)
                                .expiredUrl("/") // 세션이 만료된 경우 이동할 페이지


                );
            // 인증 및 인가(권한) 오류에 대한 예외 처리
            http
                .exceptionHandling((exception)->
                        exception
                                .authenticationEntryPoint(authenticationEntryPoint) // 인증되지 않은 사용자
                                .accessDeniedHandler(accessDeniedHandler)  // 인증되었으나 권한이 없는 사용자
                );

            // 접근 관리
            http
                .authorizeHttpRequests((authorizeRequests) ->
                            authorizeRequests
                                    .requestMatchers("/**","/api/login/**", "/api/login").permitAll()  // login 인증 절차없이 허용
//                                    .requestMatchers("/user").anonymous() // 인증되지 않은 사용자만 접근
//                                    .requestMatchers("/user/**").hasRole(UserRole.USER.name())    // 권한을 가진 사람만 접근 가능, hasAnyRole("","")
                                    .anyRequest().authenticated()   // authenticated(): 인증(로그인)한 사용자만 접근
            );

            // OAuth
            http
                .oauth2Login((oauth2Login) ->
                        oauth2Login
//                                .loginPage("/")
                                .userInfoEndpoint((userInfoEndpointConfig -> userInfoEndpointConfig
                                        .userService(customOAuth2Service)))
                                .defaultSuccessUrl("/main")
                );


            return http.build();
        }
    }