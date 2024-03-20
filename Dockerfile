# Node.js 버전 지정
FROM node:latest

# 앱 디렉토리 생성
WORKDIR /papakakao

# 필요한 패키지와 Chrome 설치
RUN apt-get update && apt-get install -y chromium

# 앱 의존성 설치
COPY package*.json ./
RUN npm install

# 앱 소스 추가
COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 앱 실행
CMD [ "node", "server.js" ]
