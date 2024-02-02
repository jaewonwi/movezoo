package com.ssafy.movezoo.auth.config.details;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userEmail) throws UsernameNotFoundException {
        System.out.println("로그인 해줘잉");
        System.out.println(userEmail);

        // 시큐리티 세션에 세션 정보를 저장해 주는데 > session은 Authentication 타입 객체여야 한다.
        // 그리고 Authentication 안의 유저는 UserDetails 타입 객체여야 한다
        // => 시큐리티 세션(내부 Authentication(내부 UserDetails))
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("not found userEmail : " + userEmail));

//        Optional<User> optionalUser = userRepository.findByEmail(userEmail);

        try {
            System.out.println("Logined User is : "+ user.toString());

            return new CustomUserDetails(user);
        } catch (UsernameNotFoundException e){
            System.out.println("Login 못했지롱 : "+ user.toString());

            e.printStackTrace();

            return null;
        }
    }
}
