document.addEventListener("DOMContentLoaded", async () => {
  const canvas = document.getElementById("roulette");
  const ctx = canvas.getContext("2d");
  const spinButton = document.querySelector("#spin");
  // const participantInput = document.getElementById("participant-name");
  // const participantWeightInput = document.getElementById("participant-weight");
  // const addParticipantButton = document.getElementById("add-participant");
  // const resetButton = document.querySelector("#reset");
  const selectorAllButton = document.querySelector("#select-all");
  const targetModal = document.querySelector("#target-modal");

  const pastelColors = [
    "#FFB6C1", // 분홍색 (LightPink)
    "#00CED1", // 청록색 (DarkTurquoise)
    "#FFD700", // 살구색 (Gold)
    "#98FB98", // 연한 민트색 (PaleGreen)
    "#DDA0DD", // 연한 라벤더색 (Lavender)
    "#20B2AA", // 연한 터콰이즈색 (LightSeaGreen)
    "#FFFACD", // 연한 노란색 (LemonChiffon)
    "#87CEEB", // 연한 파란색 (SkyBlue)
    "#FFA07A", // 연한 오렌지색 (LightSalmon)
    "#ADFF2F", // 연한 연두색 (GreenYellow)
    "#8FBC8F", // 연한 라임색 (DarkSeaGreen)
    "#9370DB", // 연한 퍼플색 (MediumPurple)
    "#00FA9A", // 연한 푸른색 (MediumSpringGreen)
    "#FF6347", // 연한 코랄색 (Tomato)
    "#FFDAB9", // 연한 샤베트색 (PeachPuff)
    "#FFE4C4", // 연한 베이지색 (Bisque)
  ];

  let roulettes = [];
  let participants = [];
  let colors = [];
  let angle = 0;
  let spinSpeed = 0; // 회전 속도 변수
  let isSpinning = false;
  let isStopping = false; // 스핀 멈추기 시작했는지 표시하는 변수
  let animationFrameId;
  let isSelectorAllClicked = false;

  const tech_7_member = [];
  const tech_7_member_Weights = [];
  const tech_7_member_profileImg = [];

  const res = await fetch("/user/list");

  const registeredUserArray = await res.json();

  registeredUserArray.users.forEach((user) => {
    tech_7_member.push(user.name);
    tech_7_member_Weights.push(user.weight.toFixed(1));
    tech_7_member_profileImg.push(user.isProfile);
  });

  const participantModal = new bootstrap.Modal(
    document.getElementById("tech-7-member-selection")
  );

  participantModal._element.addEventListener("hidden.bs.modal", function () {
    tech_7_member.forEach((member) => removeParticipant(member));
    const tech7AllMemberDOM = document.querySelectorAll(".tech7");
    tech7AllMemberDOM.forEach((input) => {
      if (input.checked) {
        const memberRatioDOM = document.querySelector(
          `.${input.id}.ratio`
        ).innerText;

        addParticipant(input.id, parseFloat(memberRatioDOM));
      }
    });
  });

  const colorSet = new Set();

  while (colorSet.size < tech_7_member.length) {
    let getColorIdx = Math.floor(Math.random() * 16);
    colorSet.add(getColorIdx);
  }

  // 참여자 추가하기
  const addParticipant = (name, weight) => {
    if (
      name.trim() === "" ||
      weight <= 0 ||
      participants.some((p) => p.name === name)
    ) {
      return;
    }

    const existingParticipant = participants.find((p) => p.name === name);

    if (existingParticipant) {
      // 사용자가 존재하면, 기존 색상 추가하기
      colors.push(existingParticipant.color);
    } else {
      // 새로운 사용자라면, 새로운 색상 추가하기

      for (let index of colorSet) {
        const randomColor = pastelColors[index];
        colors.push(randomColor);
      }
    }

    participants.push({ name, weight, color: colors[colors.length - 1] });

    drawRoulette(name);
  };

  // 참여자 제거하기
  const removeParticipant = (name) => {
    const index = participants.findIndex((p) => p.name === name);

    if (index !== -1) {
      const removedParticipant = participants.splice(index, 1)[0];

      const res = roulettes.find((roulette) => roulette.name === name);
      if (res) {
        const ctxIndex = roulettes.indexOf(res);
        roulettes.splice(ctxIndex, 1);
        res.ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Redraw the roulette without the removed participant
        drawRoulette();
      }
    }
  };

  const drawRoulette = (name) => {
    if (participants.length === 0) {
      return;
    }

    const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);
    let startAngle = 0;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    participants.forEach((participant, index) => {
      const sliceAngle = (participant.weight / totalWeight) * 2 * Math.PI;
      const endAngle = startAngle + sliceAngle;
      const textAngle = startAngle + sliceAngle / 2; // 참여자 이름을 그릴 각도

      // 섹션 그리기
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, canvas.height / 2);
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width / 2,
        startAngle,
        endAngle
      );
      ctx.fillStyle = colors[index];
      ctx.fill();

      // 참여자 이름 그리기
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(textAngle);
      ctx.textAlign = "right";
      ctx.fillStyle = "#000000"; // 텍스트 색상
      ctx.font = "14px Arial"; // 텍스트 폰트
      ctx.fillText(participant.name, canvas.width / 2 - 10, 0); // 텍스트 위치 조정
      ctx.imageSmoothingEnabled = false; // 안티엘리어싱 해제
      ctx.restore();

      startAngle = endAngle;
    });
    roulettes.push({ ctx, name });

    return ctx;
  };

  const updateRoulette = () => {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawRoulette();
    ctx.restore();
  };

  const spinRoulette = () => {
    angle += spinSpeed; // 회전 각도 증가
    if (isStopping) {
      spinButton.disabled = true;
      spinSpeed *= Math.random() * (0.995 - 0.99) + 0.99;

      if (spinSpeed <= 0.001) {
        const winner = getWinner(); // 당첨자 결정
        displayWinner(winner); // 당첨자 표시

        spinButton.disabled = false;
        isSpinning = false;
        isStopping = true;
        spinSpeed = 0;
        return;
      }
    }
    updateRoulette();
    requestAnimationFrame(spinRoulette);
  };

  spinButton.addEventListener("click", () => {
    if (participants.length === 0) {
      alert("참여자가 없습니다!");
      return;
    }
    if (!isSpinning) {
      document.getElementById("practiceModeButton").disabled = true;

      isSpinning = true;
      isStopping = false;
      spinSpeed = 0.4;

      spinButton.classList.toggle("btn-danger");
      spinButton.querySelector("span").textContent = "Stop";
      spinRoulette();
    } else {
      isStopping = true; // 스핀 멈추기 시작
      isSpinning = false;
      spinButton.classList.toggle("btn-danger");
      spinButton.querySelector("span").innerText = "Spin";
    }
  });

  drawRoulette();

  const tech_7_member_DOM = document.querySelector(".tech7-users");

  tech_7_member.forEach((name, idx) => {
    const userBtn = `
        <tr>
          <th scope="row"><input type="checkbox" id="${name}" class="tech7" /></th>
          <td>
            <label for="${name}">
              <img src="/public/imgs/${
                tech_7_member_profileImg[idx] ? name : "default-user"
              }.png" width="20px" height="20px"/>
              <span>${name}</span>
            </label>
          </td>
          <td><span class="${name} ratio">${
      tech_7_member_Weights[idx]
    }</span></td>
          <td>
          <button class="plus btn btn-primary btn-sm ms-2">＋</button>
          <button class="minus btn btn-outline-primary btn-sm">
            －
          </button>
          </td>
        </tr>
      `;
    tech_7_member_DOM.innerHTML += userBtn;
  });

  // 가중치 더하기 버튼
  document.querySelectorAll(".plus").forEach((element) => {
    element.addEventListener("click", (e) => {
      const weight = e.target.closest("td").previousElementSibling;
      const inputElement = e.target.closest("tr").querySelector(".tech7");
      const ratioElement = weight.querySelector(".ratio");

      let currentRatio = parseFloat(ratioElement.innerText, 10);
      currentRatio = Math.min(currentRatio + 0.1, 10).toFixed(1); // 최댓값은 10으로 설정

      const memberIdx = tech_7_member.findIndex(
        (member) => member === inputElement.id
      );

      tech_7_member_Weights[memberIdx] = parseFloat(currentRatio);
      ratioElement.innerText = currentRatio.toString();
    });
  });

  // 가중치 줄이기 버튼
  document.querySelectorAll(".minus").forEach((element) => {
    element.addEventListener("click", (e) => {
      const weight = e.target.closest("td").previousElementSibling;
      const inputElement = e.target.closest("tr").querySelector(".tech7");
      const ratioElement = weight.querySelector(".ratio");

      let currentRatio = parseFloat(ratioElement.innerText, 10);
      currentRatio = Math.max(currentRatio - 0.1, 1).toFixed(1); // 최소값은 1으로 설정

      const memberIdx = tech_7_member.findIndex(
        (member) => member === inputElement.id
      );

      tech_7_member_Weights[memberIdx] = parseFloat(currentRatio);
      ratioElement.innerText = currentRatio.toString();
    });
  });

  tech_7_member.forEach((member) => {
    const memberDOM = document.querySelector(`#${member}`);

    memberDOM.addEventListener("click", (e) => {
      const memberRatioDOM = document.querySelector(`.${member}.ratio`);

      // 체크되어 있는 멤버면 추가
      e.target.checked
        ? addParticipant(e.target.id, parseFloat(memberRatioDOM.innerText))
        : removeParticipant(e.target.id);
    });
  });

  // 당첨된 사람 결정하는 함수
  const getWinner = () => {
    const adjustedAngle =
      (2 * Math.PI - (angle % (2 * Math.PI))) % (2 * Math.PI); // 각도를 0에서 2π 사이 값으로 조정
    let cumulativeAngle = 0;
    const totalWeight = participants.reduce((acc, p) => acc + p.weight, 0);

    // 각 참여자에 대해
    for (const participant of participants) {
      const sliceAngle = (participant.weight / totalWeight) * 2 * Math.PI;
      cumulativeAngle += sliceAngle;
      if (adjustedAngle <= cumulativeAngle) {
        return participant.name; // 당첨된 참여자 반환
      }
    }
  };

  // 당첨자 출력하는 함수
  const displayWinner = async (winnerName) => {
    // 당첨된 유저를 표시하는 코드 (예: 알림, DOM 요소 변경 등)
    // window.alert(`당첨자: ${winnerName}`);
    if (!isPracticeMode) {
      await fetch(`/user/increase/${winnerName}`);
      await fetch(`/user/increase/participation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants,
        }),
      });
    }

    document.getElementById("practiceModeButton").disabled = false;

    const winnerHtml = document.querySelector(".target-modal-body");

    winnerHtml.innerHTML = "";
    winnerHtml.innerHTML = `
      <img src="/public/imgs/congratulation.png" class="target-modal-body-background"/>
      <div class="target-modal-body-text font-weight-bold text-center">${winnerName}님! <br/> 커피 감사합니다! ☕</div>
    `;

    targetModal.click();
  };

  // 전체 선택 버튼에 클릭 이벤트 바인딩
  selectorAllButton.addEventListener("click", () => {
    const tech7AllMemberDOM = document.querySelectorAll(".tech7");

    isSelectorAllClicked = !isSelectorAllClicked;

    if (isSelectorAllClicked) {
      tech7AllMemberDOM.forEach((input) => {
        input.checked = true;

        const member = input.id;

        const memberRatioDOM = document.querySelector(
          `.${member}.ratio`
        ).innerText;
        addParticipant(member, parseFloat(memberRatioDOM));
      });
    } else {
      tech7AllMemberDOM.forEach((input) => {
        input.checked = false;

        const member = input.id;
        removeParticipant(member);
      });
    }
  });

  const initRoulette = () => {
    const tech7AllMemberDOM = document.querySelectorAll(".tech7");
    tech7AllMemberDOM.forEach((input) => {
      input.checked = true;

      const member = input.id;

      const memberRatioDOM = document.querySelector(
        `.${member}.ratio`
      ).innerText;
      addParticipant(member, parseFloat(memberRatioDOM));
    });
  };

  initRoulette();

  let isPracticeMode = true;

  document
    .getElementById("practiceModeButton")
    .addEventListener("click", function () {
      this.classList.toggle("btn-primary");
      this.classList.toggle("btn-danger");

      isPracticeMode = !isPracticeMode;

      const buttonText = document.getElementById("buttonText");
      buttonText.textContent = isPracticeMode ? "연습 모드" : "실전 모드";

      const mainColumn = document.getElementById("main-column");
      if (!isPracticeMode) {
        mainColumn.classList.add("fire-border");
      } else {
        mainColumn.classList.remove("fire-border");
      }
    });

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".plus-permanently").forEach((button) => {
      button.addEventListener("click", function () {
        const name = this.getAttribute("data-name");
        fetch(`/user/increase/weight/${name}`, { method: "GET" }).then(
          (response) => window.location.reload()
        );
      });
    });

    document.querySelectorAll(".minus-permanently").forEach((button) => {
      button.addEventListener("click", function () {
        const name = this.getAttribute("data-name");
        fetch(`/user/decrease/weight/${name}`, { method: "GET" }).then(
          (response) => window.location.reload()
        );
      });
    });
  });

  // 이벤트 추가 함수
  function addEvent(title, start, end) {
    calendar.addEvent({
      title: title,
      start: start,
      end: end,
    });
  }
});
