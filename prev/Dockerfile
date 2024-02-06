# Node.js의 공식 이미지를 기반으로 설정
FROM node:18

# 앱 디렉토리 생성
WORKDIR /app

# 앱 의존성 설치
# package.json과 package-lock.json을 모두 복사
COPY package*.json package-lock.json ./

RUN npm install

# 앱 소스 추가
COPY . .

# 앱이 3000번 포트에서 실행됨을 알림
EXPOSE 3000

# 앱 실행
CMD [ "npm", "start" ]
