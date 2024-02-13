import RoomList from "./roomlist/RoomList";
import Room from "./room/Room";
import Game from "./game/Game";
import Result from "./result/Result";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { myGameData, playerGameDataList } from "../../components/play/data.js";


function Multi() {
  const APPLICATION_SERVER_URL =
    process.env.NODE_ENV === "production" ? "" : "https://i10e204.p.ssafy.io/";

  // 게임시작관리(props로 념겨줌)
  const [isPlayingGame, setIsPlayingGame] = useState(false);
  const [mySessionId, setMySessionId] = useState(null);
  const [myUserName, setMyUserName] = useState(
    "Participant" + Math.floor(Math.random() * 100)
  );
  const [session, setSession] = useState(undefined);
  const [mainStreamManager, setMainStreamManager] = useState(undefined);
  const [publisher, setPublisher] = useState(undefined);
  const [subscribers, setSubscribers] = useState([]);

  const [page, setPage] = useState(1);

  //창희 추가 start
  const [connectionId, setConnectionId] = useState(null);
  const [chatMessage, setChatMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [myRoom, setMyRoom] = useState({});
  const navigate = useNavigate();
  //창희 추가 end

  let OV, currentVideoDevice;
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = "";
      console.log("exiting test", mySessionId, connectionId);
      console.log("Exiting page");
      leaveSession();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [mySessionId, connectionId]);

  const handleChangeSessionId = (e) => {
    setMySessionId(e.target.value);
  };

  const handleChangeUserName = (e) => {
    setMyUserName(e.target.value);
  };

  const handleMainVideoStream = (stream) => {
    if (mainStreamManager !== stream) {
      setMainStreamManager(stream);
    }
  };

  const deleteSubscriber = (streamManager) => {
    setSubscribers((prevSubscribers) => {
      // streamManager를 사용하여 삭제할 구독자를 찾아서 제외합니다.
      const updatedSubscribers = prevSubscribers.filter(
        (subscriber) => subscriber.stream.streamManager !== streamManager
      );
      return updatedSubscribers;
    });
  };

  const createRoom = async (roomInfo) => {
    OV = new OpenVidu();
    OV.enableProdMode();

    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    //창희 추가 start//
    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    newSession.on("signal:my-chat", (event) => {
      console.log();

      const userName = JSON.parse(event.from.data).clientData;
      const newMessage = {
        id: event.from.connectionId, // 보낸 사람의 아이디
        name: userName,
        message: event.data, // 채팅 메시지 내용
      };

      // 기존 채팅 메시지 배열에 새로운 메시지 추가
      const updatedMessages = [...chatMessages, newMessage];

      console.log(updatedMessages);
      // 상태 업데이트
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // this.setState({ chatMessages: updatedMessages });
    });

    newSession.on("signal:master-out", (event) => {
      console.log("받다 마스터");
      disconnectionStream();
      alert("방장이 방을 나갔습니다.");

      // 상태 업데이트
      setMyRoom({});
    });
    //창희 추가 end//

    try {
      const token = await getToken(roomInfo);
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          setConnectionId(newSession.connection.connectionId);
          let newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          newSession.publish(newPublisher);

          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);

          myGameData.playerId = myUserName;
          let existMyData = false;
          playerGameDataList.forEach((item) => {
            if (item === myGameData.playerId) {
              existMyData = true;
            }
          });
          if (!existMyData) playerGameDataList.push(myGameData);

          setIsPlayingGame(true);
          console.log(
            `joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`
          );
        })
        .catch((error) => {
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  const enterRoom = async (enterSessionId) => {
    OV = new OpenVidu();
    OV.enableProdMode();

    const newSession = OV.initSession();
    setSession(newSession);

    newSession.on("streamCreated", (event) => {
      const subscriber = newSession.subscribe(event.stream, undefined);
      setSubscribers((prevSubscribers) => [...prevSubscribers, subscriber]);
    });

    newSession.on("streamDestroyed", (event) => {
      deleteSubscriber(event.stream.streamManager);
    });

    //창희 추가 start//
    newSession.on("exception", (exception) => {
      console.warn(exception);
    });

    newSession.on("signal:my-chat", (event) => {
      console.log();
      // const { chatMessages } = this.state;

      const userName = JSON.parse(event.from.data).clientData;
      const newMessage = {
        id: event.from.connectionId, // 보낸 사람의 아이디
        name: userName,
        message: event.data, // 채팅 메시지 내용
      };

      // 기존 채팅 메시지 배열에 새로운 메시지 추가
      const updatedMessages = [...chatMessages, newMessage];

      console.log(updatedMessages);
      // 상태 업데이트
      setChatMessages((chatMessages) => [...chatMessages, newMessage]);
      // this.setState({ chatMessages: updatedMessages });
    });

    newSession.on("signal:master-out", (event) => {
      console.log("받다 마스터");

      disconnectionStream();

      // 상태 업데이트
      setMyRoom({});
      alert("방장이 방을 나갔습니다.");
    });
    //창희 추가 end//

    try {
      const token = await createToken(enterSessionId);
      newSession
        .connect(token, { clientData: myUserName })
        .then(async () => {
          setConnectionId(newSession.connection.connectionId);

          let newPublisher = await OV.initPublisherAsync(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: true,
            publishVideo: true,
            resolution: "640x480",
            frameRate: 30,
            insertMode: "APPEND",
            mirror: false,
          });

          newSession.publish(newPublisher);

          const devices = await OV.getDevices();
          const videoDevices = devices.filter(
            (device) => device.kind === "videoinput"
          );
          const currentVideoDeviceId = newPublisher.stream
            .getMediaStream()
            .getVideoTracks()[0]
            .getSettings().deviceId;
          currentVideoDevice = videoDevices.find(
            (device) => device.deviceId === currentVideoDeviceId
          );

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);

          myGameData.playerId = myUserName;
          let existMyData = false;
          playerGameDataList.forEach((item) => {
            if (item === myGameData.playerId) {
              existMyData = true;
            }
          });
          if (!existMyData) playerGameDataList.push(myGameData);

          setIsPlayingGame(true);
          console.log(
            `joinsession : playerId init!!!!!!!! <${myGameData.playerId}>`
          );

          // //발급받은 토큰으로 연결 완료 되면 sessionId set
          // setMySessionId(enterSessionId);
        })
        .catch((error) => {
          console.log(
            "세션에 연결 중 오류가 발생했습니다:",
            error.code,
            error.message
          );
        });
    } catch (error) {
      console.error("Error joining session:", error);
    }
  };

  const exitRoom = async () => {
    await axios.patch(
      APPLICATION_SERVER_URL + "api/room/exit",
      {
        roomSessionId: mySessionId,
        connectionId: connectionId,
      },
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const deleteRoom = async () => {
    console.log("delete room", APPLICATION_SERVER_URL + `api/room/delete/${mySessionId}`);
    await axios.delete(
      APPLICATION_SERVER_URL + `api/room/delete/${mySessionId}`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const leaveSession = async () => {
    const masterId = myRoom.roomMasterId;
    const storedUserData = localStorage.getItem('userData');
    const data = (JSON.parse(storedUserData));

    console.log("Exit ", mySessionId, masterId);

    if (masterId === data.userData.userId) {
      console.log("master out[ masterId, userId]", masterId, data.userData.userId);
      //레디스에서 방삭제
      await deleteRoom();

      //시그널
      if (session) {
        session
          .signal({
            type: "master-out",
          })
          .then(() => {
            console.log("master out signal sned");
            disconnectionStream();
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } else {
      await exitRoom();
      disconnectionStream();
    }

    //방장이 나가면서 세션을 없에기때문에 캠이 계속 켜져있다
    // if (session) {
    //   session.disconnect();
    // }
  };


  const leaveSessionSetInfo = () => {
    setIsPlayingGame(false);
    setSession(undefined);
    setSubscribers([]);
    setMySessionId(null);
    setMyUserName("Participant" + Math.floor(Math.random() * 100));
    setMainStreamManager(undefined);
    setPublisher(undefined);
    console.log("leave session complete!!!");
    navigate("/main");
  }
  const disconnectionStream = () => {
    if (mainStreamManager) {
      mainStreamManager.stream.disposeWebRtcPeer();
    }
    if (publisher) {
      publisher.stream.disposeWebRtcPeer();
    }
    leaveSessionSetInfo();
  }

  //disconnectionSession
  const switchCamera = async () => {
    try {
      const devices = await OV.getDevices();
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );

      if (videoDevices && videoDevices.length > 1) {
        const newVideoDevice = videoDevices.filter(
          (device) => device.deviceId !== currentVideoDevice.deviceId
        );

        if (newVideoDevice.length > 0) {
          const newPublisher = OV.initPublisher(undefined, {
            videoSource: newVideoDevice[0].deviceId,
            publishAudio: true,
            publishVideo: true,
            mirror: true,
          });

          await session.unpublish(mainStreamManager);
          await session.publish(newPublisher);

          setMainStreamManager(newPublisher);
          setPublisher(newPublisher);
        }
      }
    } catch (error) {
      console.error("Error switching camera:", error);
    }
  };

  const getToken = async (roomInfo) => {
    const sessionId = await createSession(roomInfo);
    return await createToken(sessionId);
  };

  //방 만들기(사용자가 입력한 방정보를 넣는다, 세션아이디는 서버에서 만들어 반환)
  const createSession = async (roomInfo) => {
    console.log(roomInfo)
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/room",
        {
          roomMode: roomInfo.roomMode,
          roomTitle: roomInfo.roomTitle,
          roomPassword: roomInfo.roomPassword,
          maxRange: roomInfo.maxRange
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("make room ", response.data);
      return response.data.roomSessionId;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  //방 입장을 위한 토큰 발급받기(백에서 발급된 세션아이디로 join)
  const createToken = async (sessionId) => {
    console.log("createToken ", sessionId, myUserName);
    try {
      const response = await axios.post(
        APPLICATION_SERVER_URL + "api/room/enter",
        {
          roomSessionId: sessionId,
          nickname: myUserName,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const roomInfo = await axios.post(
        APPLICATION_SERVER_URL + "api/room/find-sessionId",
        {
          roomSessionId: sessionId,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // console.log("roomInfo ", roomInfo.data)
      setMyRoom(roomInfo.data);
      setMySessionId(roomInfo.data.roomSessionId);

      return response.data;
    } catch (error) {
      console.error("Error creating token:", error);
      throw error;
    }
  };

  // useEffect(() => {
  //   joinSession();
  //   console.log(mainStreamManager);
  //   console.log(session);
  //   // console.log(`mySessionId: ${mySessionId}`)
  // }, [mySessionId]);

  const func = (sessionId) => {
    console.log(`sessionId: ${sessionId}`);
    setMySessionId(sessionId);
    setMyUserName(myUserName);
    setMainStreamManager(mainStreamManager);
    setSubscribers(subscribers);
    setPublisher(publisher);
  };

  return (
    <div>
      {page === 1 ?
        <RoomList
          setPage={setPage}
          func={func}
          createRoom={createRoom}
          enterRoom={enterRoom}
          mySessionId={mySessionId}
        /> : null}
      {page === 2 ? (
        <Room
          setPage={setPage}
          session={session}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          setSubscribers={setSubscribers}
          publisher={publisher}
          mySessionId={mySessionId}
          connectionId={connectionId}
          chatMessage={chatMessage}
          setChatMessage={setChatMessage}
          chatMessages={chatMessages}
          setChatMessages={setChatMessages}
          leaveSession={leaveSession}
        />
      ) : null}
      {page === 3 ? (
        <Game
          setPage={setPage}
          session={session}
          mainStreamManager={mainStreamManager}
          subscribers={subscribers}
          publisher={publisher}
          mySessionId={mySessionId}
          isPlayingGame={isPlayingGame}
          leaveSession={leaveSession}
        />
      ) : null}
      {page === 4 ? (
        <Result
          setPage={setPage}
          mySessionId={mySessionId}
          session={session}
          mainStreamManager={mainStreamManager}
          setMySessionId={setMySessionId}
          leaveSession={leaveSession}
        />
      ) : null}
    </div>
  );
}

export default Multi;
