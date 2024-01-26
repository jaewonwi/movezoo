package com.ssafy.racing.friendship.domain;

import com.ssafy.racing.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Entity
@Getter
@Setter
public class Friend {

    @Id
    @GeneratedValue
    private int friendId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne( fetch = FetchType.LAZY)
    @JoinColumn(name = "friend_user_id")
    private User friendUser;

    public Friend(User user, User friendUser) {
        this.user = user;
        this.friendUser = friendUser;
    }

    public Friend() {

    }
}

