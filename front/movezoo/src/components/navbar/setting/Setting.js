import React, { useState } from 'react';
import Modal from 'react-modal';
import { AiFillSetting, AiFillSound } from 'react-icons/ai';
import './Setting.css';
import { IoCloseSharp } from "react-icons/io5";

const Setting = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [volume, setVolume] = React.useState(20);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
  };

  React.useEffect(() => {
    const audioElement = document.getElementById("background-audio");
    audioElement.volume = volume / 100;
  }, [volume]);


  return (
    <div className='setting'>
      <div className='setting-button-container' onClick={openModal}>
        <AiFillSetting className='settingButton'/>
      </div>

      <Modal 
      isOpen={isOpen} 
      onRequestClose={closeModal}
      style={{
        overlay: {
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // 투명도를 0.75로 설정한 검은색 배경
        },
        content: {
          width: '500px',
          height: '500px',
          margin: 'auto',
          borderRadius: '30px',
        }
      }}
      >
        <div className='setting-container'>
          <div className='setting-header'>
            <div className='setting-header-name'>
              <h1>설정</h1>
            </div>
            <div className='shop-header-exit'>
              <IoCloseSharp className='exit-button' onClick={closeModal} />
            </div>
          </div>

          <div className='setting-body'>
            <div className='setting-sound'>
              <div className='sound-image'>
                <AiFillSound />
              </div>
              <div>
                <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                  />
              </div>
            </div>
          </div>
        </div>
        
      </Modal>
    </div>
  );
};

export default Setting;
