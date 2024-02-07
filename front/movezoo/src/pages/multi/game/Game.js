
import styles from "./Game.module.css";
import "./Game.module.css";
// import Webcam from "react-webcam";
import Back from "../../../components/single/game/Back";
import Main from "../../../components/play/Main";
import Cam from "../../../components/play/Cam";

function Game(props) {
  return (
    <div>
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 화면, 게임 화면*/}
        <div className={styles.leftSection}>
          {/* <p style={{ textAlign: "center" }}>
            <strong>게임 화면</strong>
          </p> */}
          <Main width={1150} height={700} />
          {/* 뒤로가면 메인 화면*/}
          <div className={styles.goBack}>
            <Back />
          </div>
          {/*웹캠*/}
          {/* <div className={styles.webCam}> */}
          <Cam />
          multigame
          {/* </div> */}
          {/* <Webcam className={styles.webCam} mirrored={true} /> */}
          {/* 일단 결과창으로 넘어가는 버튼*/}
          <button onClick={()=> props.setPage(4)}
            style={{
              position: "relative",
              textAlign: "center",
              bottom: "50%",
              width: 160,
              height: 80,
              color: "white",
              backgroundColor: "tomato",
            }}
          >
            넘어가기
            <br />
            (임시버튼)
          </button>
        </div>

        {/*오른쪽 화면*/}
        <div className={styles.rightSection}>
          <div className={styles.userSection}>
            <div className={styles.userBox}>1</div>
            <div className={styles.userBox}>2</div>
            <div className={styles.userBox}>3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Game;