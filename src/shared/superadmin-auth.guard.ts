import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
@Injectable()
export class SuperAdminAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext,): Promise<boolean>{
    const request = context.switchToHttp().getRequest();
    if(!request.headers.authorization){
        return false;
    }
    const decoded = await this.validateToken(request.headers.authorization);
    const { member_type,user_type } = decoded;
    if(member_type == 1 && user_type == "Dashboard"){
      return true;
    }
    return false;
  }

  async validateToken(auth:string){
      if(auth.split(' ')[0] !== 'Bearer'){
          throw new HttpException('Invalid Token',HttpStatus.FORBIDDEN);
      }
      const token  = auth.split(' ')[1];
      try{
        const decoded = await jwt.verify(token,process.env.SECRET);
        return decoded;
      }catch(err){
          const message = "Token error: "+(err.message || err.name);
          throw new HttpException(message,HttpStatus.FORBIDDEN);
      }
      

  }
}

