package com.ssafy.movezoo.user.sevice;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    // 사용자 정보 조회
    public User findById(int userId){
        return userRepository.findById(userId);
    }

    // 비밀번호 변경
    public int changePassword(String userEmail, String password){
        return userRepository.updatePassword(userEmail, password);
    }

    // 닉네임 변경
    public int changeNickname(String userEmail, String nickname){
        return userRepository.updateNickname(userEmail, nickname);
    }

    // 설정 변경
    public int changeSetting(int userId, int volume, int mic, int cameraSensitivity){
        return userRepository.updateSetting(userId, volume, mic, cameraSensitivity);
    }

    // 회원가입
    // 아이디 중복 체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkUsersEmailDuplicate(String usersEmail){
        System.out.println("이메일 중복체크: "+usersEmail);
        Optional<User> userOptional = userRepository.findByEmail(usersEmail);

        if (userOptional.isPresent())
            System.out.println(userOptional.get().toString());

        // Optional이 비어있으면 false를 반환하도록 기본값을 설정
        if (userOptional.isPresent())
            return true;

        return false;
    }

    // 닉네임 중복체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkNicknameDuplicate(String nickname){
        System.out.println("닉네임 중복체크: "+nickname);
        Optional<User> userOptional = userRepository.findByNickname(nickname);

        if (userOptional.isPresent())
            System.out.println(userOptional.get().toString());

        // Optional이 비어있으면 false를 반환하도록 기본값을 설정
        if (userOptional.isPresent())
            return true;

        return false;
    }

    // 회원가입
    public boolean join(User user){
        userRepository.save(user);
        return true;
    }

    public void addUserCoin(int userId, int coin){
        User user = userRepository.findById(userId);
        user.setCoin(user.getCoin()+coin);
    }

    public void useUserCoin(int userId, int coin){
        User user = userRepository.findById(userId);
        user.setCoin(user.getCoin()-coin);
    }


}
