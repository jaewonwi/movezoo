const data = {
  isLeftKeyPressed: false,
  isRightKeyPressed: false,
  isBreak : false,
  isRun: true // Test중... false로 바꿔야됨
};

const playerCount = { value: 1 };
const myGameData = { playerId: '', playerCharacter: '', userX: 0, userZ: 0, speed: 0 }
const playerGameDataList = [];  // myGameData이 모인 리스트
const playerGameResetDataList = { value: [] };

// 1. 게임이 시작될 때, 먼저 나의 id와 캐릭터 정보를 myPlayerData를 저장한다.
// 그리고 최초 playerList

// 2. 받는 사람은 받은 데이터의 id를 확인하고 각 id 별로 렌더링을 한다.

export { data, myGameData, playerGameDataList, playerCount, playerGameResetDataList }