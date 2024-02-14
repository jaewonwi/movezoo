import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Webcam from "react-webcam";
import Back from "../../../components/multi/result/Back";
import Record from "../../../components/single/result/Record";
import './Result.css';

function Result(props) {
  const [loading, setLoading] = useState(true);
  const leaveSession = props.leaveSession;
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true }).then(() => {
      setLoading(false);
    });
  }, []);
  return (
    <div>
      {/*일단 축소 화면*/}
      <div className="multi-result-container">

        <div className="multi-result-header">
          <div>
            <p className="multi-result-name">RESULT</p>
          </div>
        </div>

        <div className="multi-result-body-card">

          <div className="multi-result-body">

            {/*왼쪽 화면, 웹캠 화면*/}
            <div className="multi-result-leftSection">

              <div className="multi-result-topCamSection">
                <div className="multi-result-firstWebCam">
                  {loading ? (
                    <h1>Loading...</h1>
                  ) : (
                    <Webcam mirrored={true} />
                  )}
                </div>

                <div className="multi-result-secondCam">
                  <div>
                    2등 웹캠
                  </div>
                </div>
              </div>

              <div className="multi-result-bottomCamSection">
                
                  <div className="multi-result-thirdCam">
                    3등웹캠
                  </div>

                  <div className="multi-result-FourthCam">
                    4등 웹캠
                  </div>
                  
              </div>

            </div>

            {/*오른쪽 화면*/}
            <div className="multi-result-rightSection">

              {/*보상 및 돌아가기 버튼*/}
              <div className="multi-result-anotherSection">
                <div className="multi-result-reward">
                  <span>G</span>
                  <span>#획득 골드#</span>
                  <span>획득!</span>
                </div>
                {/* 돌아가기 버튼*/}
                <div className="multi-result-backbutton">
                  <Back leaveSession={leaveSession}/>
                </div>
              </div>

            </div>


          </div>

        </div>



      </div>
    </div>
  );
}
export default Result;
