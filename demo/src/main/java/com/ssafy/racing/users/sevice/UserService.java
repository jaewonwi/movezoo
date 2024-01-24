package com.ssafy.racing.users.sevice;

import com.ssafy.racing.users.domain.Users;
import com.ssafy.racing.users.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    // 비밀번호 변경
    public int changePassword(String usersEmail, String password){
        return userRepository.updatePassword(usersEmail,password);
    }

    // 회원가입
    // 아이디 중복 체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkUsersEmailDuplicate(String usersEmail){
        userRepository.findByEmail(usersEmail);
        Users users = userRepository.findByEmail(usersEmail);
        return !users.getUsersEmail().equals(usersEmail);
    }

    // 닉네임 중복체크 (중복일 경우 true, 중복이 아닐 경우 false)
    public boolean checkNicknameDuplicate(String nickname){
        Users users = userRepository.findByNickname(nickname);
        return !users.getNickname().equals(nickname);
    }

    public Users join(Users users){
        return userRepository.save(users);
    }


}
