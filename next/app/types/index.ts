import { Document } from "mongoose";

interface User extends Document {
  name: string;
  times?: number; // 선택적 필드는 '?'를 사용하여 표시합니다.
  weight: number;
  isProfile?: boolean;
  histories: History[]; // History 인터페이스 배열 타입
  participationCount?: number;
  // Mongoose 타임스탬프 필드
  createdAt?: Date;
  updatedAt?: Date;
}

export default User;