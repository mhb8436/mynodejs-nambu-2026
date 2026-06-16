import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService, 
        private readonly jwtService: JwtService
    ) {}

    async register(dto : RegisterDto) {
        const exists = await this.usersService.findByEmail(dto.email); // 기존 유저체크
        if(exists) throw new ConflictException(`이미 가입된 이메일입니다.`)
        
        const hashed = await bcrypt.hash(dto.password, 10); // 비밀번호 암호하 
        const user = await this.usersService.createUser({
            email: dto.email,
            name: dto.name,
            password: hashed,
            role: dto.role ?? "BUYER"
        }); // 유저생성 
        const {password, ...result} = user; // 비밀번호를 빼고 나머지 데이터 반환 
        return result;
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email)
        const isRight = await bcrypt.compare(dto.password, user!.password);

        if(!user || !isRight) {
            throw new UnauthorizedException(`이메일 또는 비번이틀려요`)
        }
        const payload = { 
            sub: user.id, email: user.email, role: user.role
        }
        return {
            access_token : this.jwtService.sign(payload)
        }
    }
}
