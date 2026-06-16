## 1. 프로젝트 생성
### 1.1 디렉토리 생성
mkdir 13
cd 13

nest new shop --skip-git

cd shop 

## 2. 모듈 생성
nest g resource categories --no-spec
nest g resource products --no-spec
nest g resource users --no-spec


## 3. 패키지설치 
npm i class-validator class-transformer dotenv
npm i @prisma/client@6
npm i -D prisma@6
npm i @nestjs/swagger


##  4. prisma generate
```bash
npx prisma init 
npx prisma format
```

## 5. schema.prisma 모델 설정 

## 6. database create (postgresql)
###   데이터베이스 이름은 myshop 
```bash
psql -U postgres postgres;
create database myshop;
grant all PRIVILEGES on database shop to postgres
\c myshop
\l # 데이터베이스조회
\d # 테이블보기
\d 테이블명 # 테이블 상세보기  
grant all on schema public to postgres
```

## 7. .env 에 설정 
DATABASE_URL="postgresql://<사용자계정>:<비밀번호>@localhost:5432/myshop?schema=public"

## bash 
npx prisma migrate dev --name init 
npx prisma generate

## prisma Service 
nest g module prisma
nest g service prisma --no-spec

## main.ts 

## controller.ts

## dto.ts

## service.ts  