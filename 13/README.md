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

## 소스코딩


# JWT 인증 추가 

## 1. 관련 패키지 설치 
```bash
npm i @nestjs/jwt@11 @nestjs/passport@11 passport@0.7 passport-jwt@4 bcrypt@6
npm i -D @types/passport-jwt@4 @types/bcrypt@6
```

## 2. .env JWT 시크릿추가 
```env
JWT_SECRET="dev-secret-change-me"
```

## 3. 관련 모듈 생성
```bash
nest g module auth
nest g service auth --no-spec
nest g controller auth --no-spec
nest g guard auth/guards/jwt-auth --no-spec
```
## 4. schema 수정
```bash
npx prisma format 
npx prisma migrate dev --name add-auth 
npx prisma generate 
```
