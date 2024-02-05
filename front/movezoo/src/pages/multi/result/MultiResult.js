import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./MultiResult.module.css";
import Webcam from "react-webcam";
import Back from "../../../components/single/result/Back";
import Record from "../../../components/single/result/Record";

function Result() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {/*일단 축소 화면*/}
      <div className={styles.container}>
        {/*왼쪽 화면, 웹캠 화면*/}
        <div className={styles.leftSection}>
          {loading ? (
            <h1>Loading...</h1>
          ) : (
            <Webcam className={styles.webCam} mirrored={true} />
          )}
        </div>

        {/*오른쪽 화면*/}
        <div className={styles.rightSection}>
          {/*기록들*/}
          <div className={styles.camSection}>
            <div
              style={{
                width: "100%",
                height: "40%",
                border: "black 1px solid",
              }}
            >
              <p style={{ backgroundColor: "white" }}>2등</p>
              <div
                style={{
                  display: "relative",
                  width: "100%",
                  height: "50%",
                  padding: "5px",
                }}
              >
                웹캠
              </div>
            </div>
            <div
              style={{
                width: "100%",
                height: "40%",
                border: "black 1px solid",
              }}
            >
              <p style={{ backgroundColor: "white" }}>3,4등</p>
              <div style={{ display: "flex" }}>
                <div
                  style={{
                    display: "relative",
                    width: "100%",
                    height: "50%",
                    padding: "5px",
                  }}
                >
                  웹캠
                </div>
                <div
                  style={{
                    display: "relative",
                    width: "100%",
                    height: "50%",
                    padding: "5px",
                  }}
                >
                  웹캠
                </div>
              </div>
            </div>
          </div>
          {/*보상 및 돌아가기 버튼*/}
          <div>
            <div className={styles.resultReward}>
              <span>G</span>
              <span>#획득 골드#</span>
              <span>획득!</span>
            </div>
            {/* 돌아가기 버튼*/}
            <div className={styles.btnStart}>
              <Back />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Result;