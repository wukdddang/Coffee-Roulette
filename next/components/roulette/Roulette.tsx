"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaRotateRight } from "react-icons/fa6";
import { VscTriangleLeft } from "react-icons/vsc";
import { IoPeopleSharp } from "react-icons/io5";
import { BsFire } from "react-icons/bs";
import { FaRunning } from "react-icons/fa";

import { getPastelColors, pastelColors } from "@/constants/colors";
import { User } from "@/context/GlobalProvider";
import IconButton from "../buttons/IconButton";
import useFetchUserList from "@/hooks/useFetchUserList";

export default function Roulette() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { participants } = useFetchUserList();
  const [colors, setColors] = useState<pastelColors[]>([]);
  const [mode, setMode] = useState<"practice" | "hard">("practice");

  let roulettes = [];
  let isStopping = false;
  let isSpinning = false;
  let spinSpeed = 0.4; // 초기 회전 속도
  let angle = 0; // 초기 각도

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

  const displayWinner = async (winnerName?: string) => {
    // 당첨된 유저를 표시하는 코드 (예: 알림, DOM 요소 변경 등)
    const targetModal = document.querySelector("#target-modal") as HTMLElement;

    if (mode === "hard") {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASEPATH}/api/user/increase/${winnerName}`
      ).then((res) => {
        if (res.ok) {
          console.log("성공");
        } else {
          console.log("실패");
        }
      });
      await fetch(
        `${process.env.NEXT_PUBLIC_BASEPATH}/api/user/increase/participation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            participants,
          }),
        }
      );
    }

    const winnerHtml = document.querySelector(
      ".target-modal-body"
    ) as HTMLElement;

    winnerHtml.innerHTML = "";
    winnerHtml.innerHTML = `
      <img src="${process.env.NEXT_PUBLIC_BASEPATH}/imgs/congratulation.png" class="target-modal-body-background"/>
      <div class="target-modal-body-text font-weight-bold text-center">${winnerName}님! <br/> 커피 감사합니다! ☕</div>
    `;

    targetModal.click();
  };

  const spinRoulette = () => {
    if (!canvasRef.current) {
      return;
    }

    const inGameButton = document.querySelector("#inGame") as HTMLButtonElement;
    if (inGameButton) {
      inGameButton.disabled = true;
    }

    angle += spinSpeed;

    if (isStopping) {
      // 멈추기 시작했을 때
      spinSpeed *= Math.random() * (0.995 - 0.99) + 0.99;
      if (spinSpeed <= 0.001) {
        const winner = getWinner(); // 당첨자 결정
        displayWinner(winner); // 당첨자 표시

        const stopButton = document.querySelector("#spin") as HTMLButtonElement;

        // 멈춘 경우
        isStopping = false;
        isSpinning = false;
        spinSpeed = 0.4;
        if (stopButton) {
          stopButton.disabled = false;
          stopButton.innerHTML = `
          <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"></path></svg>
          룰렛 돌리기`;
        }

        if (inGameButton) {
          inGameButton.disabled = false;
        }

        return; // 회전 중단
      }
    }

    updateRoulette(); // 룰렛 업데이트
    requestAnimationFrame(spinRoulette); // 계속해서 자기 자신을 호출
  };

  const toggleSpin = () => {
    const stopButton = document.querySelector("#spin") as HTMLButtonElement;
    const inGameButton = document.querySelector("#inGame") as HTMLButtonElement;

    if (isSpinning && !isStopping) {
      isStopping = true;
      if (stopButton) {
        stopButton.disabled = true;
        inGameButton.disabled = true;
        stopButton.innerHTML = `
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="M463.5 224H472c13.3 0 24-10.7 24-24V72c0-9.7-5.8-18.5-14.8-22.2s-19.3-1.7-26.2 5.2L413.4 96.6c-87.6-86.5-228.7-86.2-315.8 1c-87.5 87.5-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3c62.2-62.2 162.7-62.5 225.3-1L327 183c-6.9 6.9-8.9 17.2-5.2 26.2s12.5 14.8 22.2 14.8H463.5z"></path></svg>
        룰렛 돌리기`;
      }
    } else if (!isSpinning) {
      if (stopButton) {
        stopButton.innerHTML = `
        <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" height="12px" width="12px" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm96 328c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V176c0-8.8 7.2-16 16-16h160c8.8 0 16 7.2 16 16v160z"></path></svg>
        룰렛 멈추기
        `;
      }
      isSpinning = true;
      spinRoulette();
    }
  };

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 요소 교환
    }
    return array;
  };

  const drawRoulette = (
    userData: User[],
    // name: string,
    canvas: HTMLCanvasElement
  ) => {
    if (userData.length === 0) {
      return;
    }

    const totalWeight = userData.reduce((acc, p) => acc + p.weight, 0);
    let startAngle = 0;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      userData.forEach((participant, index) => {
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
        ctx.font = "Bold 14px Pretendard"; // 텍스트 폰트
        ctx.fillText(participant.name, canvas.width / 2 - 10, 0); // 텍스트 위치 조정
        ctx.imageSmoothingEnabled = false; // 안티엘리어싱 해제
        ctx.restore();

        startAngle = endAngle;
      });
      roulettes.push({ ctx, name });

      return ctx;
    }
  };

  const updateRoulette = () => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angle);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);
    drawRoulette(participants, canvas); // 룰렛 다시 그리기
    ctx.restore();
  };

  useEffect(() => {
    if (participants && participants.length > 0) {
      const availableColors = shuffleArray(getPastelColors());
      setColors(availableColors);
    }
  }, [participants]);

  useEffect(() => {
    if (participants && participants.length > 0 && colors.length > 0) {
      drawRoulette(participants, canvasRef.current!);
    }
  }, [participants, colors]);

  return (
    <>
      <motion.div
        // TODO: motion.div 애니메이션 분리 필요
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {!participants || participants.length === 0 ? (
          <div className="tw-flex tw-justify-center tw-items-center tw-relative tw-h-[400px] tw-text-[24px] tw-font-bold">
            룰렛을 렌더링 중입니다...
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              id="roulette-container"
              className="tw-relative"
            >
              <canvas
                ref={canvasRef}
                id="roulette"
                width="300"
                height="300"
                className="tw-shadow-xl"
              ></canvas>
              <div className="tw-absolute -tw-right-8 tw-top-44">
                <VscTriangleLeft size={36} />
              </div>
            </motion.div>
            <div className="tw-flex tw-justify-center tw-flex-col tw-gap-2 tw-items-center">
              <IconButton
                id="spin"
                icon={<FaRotateRight size={12} />}
                text={"룰렛 돌리기"}
                type="button"
                className="tw-w-[240px] tw-text-[12px] sm:tw-text-[16px] tw-bg-green-500 hover:tw-bg-green-600 active:tw-bg-green-600 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg tw-flex tw-justify-center tw-items-center tw-gap-2 disabled:tw-opacity-50"
                action="spin"
                onClick={toggleSpin}
              />

              {mode === "practice" ? (
                <IconButton
                  icon={<FaRunning />}
                  text="연습 모드"
                  type="button"
                  id="inGame"
                  className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-w-[240px] tw-text-[12px] sm:tw-text-[16px] tw-bg-blue-500 hover:tw-bg-blue-600 active:tw-bg-blue-600 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg disabled:tw-opacity-50"
                  action="inGame"
                  onClick={() => {
                    setMode("hard");
                  }}
                />
              ) : (
                <IconButton
                  icon={<BsFire />}
                  text="실전 모드"
                  type="button"
                  id="inGame"
                  className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-w-[240px] tw-text-[12px] sm:tw-text-[16px] tw-bg-rose-600 hover:tw-bg-rose-700 active:tw-bg-rose-700 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg disabled:tw-opacity-50"
                  action="inGame"
                  onClick={() => {
                    setMode("practice");
                  }}
                />
              )}
              <IconButton
                icon={<IoPeopleSharp />}
                text="참여자 선택"
                type="button"
                className="tw-flex tw-justify-center tw-items-center tw-gap-2 tw-w-[240px] tw-text-[12px] sm:tw-text-[16px] tw-bg-gray-800 hover:tw-bg-gray-900 active:tw-bg-gray-900 tw-text-white tw-py-2 tw-px-3 tw-rounded-lg"
                action="choose"
              />
            </div>
          </>
        )}
      </motion.div>
      {mode === "hard" && (
        <div className="fire tw-fixed tw-w-full tw-h-full tw-inset-0 -tw-z-10 tw-opacity-70" />
      )}
    </>
  );
}
