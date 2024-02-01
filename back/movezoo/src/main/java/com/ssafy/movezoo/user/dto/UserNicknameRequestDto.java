package com.ssafy.movezoo.user.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserNicknameRequestDto {
    private String userEmail;
    private String nickname;
}
