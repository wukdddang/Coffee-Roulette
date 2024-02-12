"use client";

interface UserWeightButtonProps {
  name: string;
  weight: number;
  onWeightChange: (delta: number) => void; // 타입 추가
}

const UserWeightButton = ({
  name,
  weight,
  onWeightChange,
}: UserWeightButtonProps) => {
  // console.log(weight);
  return (
    <div>
      <button
        onClick={() => onWeightChange(0.1)}
        className="tw-p-2 tw-px-4 tw-rounded-md tw-bg-emerald-400 tw-text-white"
      >
        +
      </button>
      <button
        onClick={() => onWeightChange(-0.1)}
        className="tw-p-2 tw-px-4 tw-rounded-md tw-bg-red-500 tw-text-white"
      >
        -
      </button>
      <input type="hidden" name="name" value={name} />
      <input type="hidden" name="weight" value={weight} />
    </div>
  );
};

export default UserWeightButton;
