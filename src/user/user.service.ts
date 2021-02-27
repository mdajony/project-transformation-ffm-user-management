import { Injectable, HttpException, HttpStatus, HttpService, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../user/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs/operators';
import { DashboardUserEntity } from './superadmin.entity';
import * as md5 from 'md5';
import * as bcrypt from 'bcrypt';
var jwtDecode = require('jwt-decode');




@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
        @InjectRepository(DashboardUserEntity) private dashboardUserRepository:Repository<DashboardUserEntity>,
        private readonly httpService: HttpService
    ){}

    async createUser(payload){
       try{
        let checkUserExist = await this.userRepository.findOne({where:{phone_number:payload.phone_number,company_id:payload.company_id}});
        console.log(checkUserExist);
        if(checkUserExist){
            return {
                "status":true,
                "statusCode":403,
                "message":"User Already Exist"
            };
        }
        let user = new UserEntity();
        user.phone_number = payload.phone_number;
        user.company_id = payload.company_id;
        user.member_type = payload.member_type;
        let data = await this.userRepository.save(user);
        return {
            "status":true,
            "statusCode":HttpStatus.CREATED,
            "data":data
        };
       }catch(err){
        return {
            "status":false,
            "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
            "message":err.message
        };
       }
            
    }

    async updateUser(payload,user_id){
        //return payload;
        try{
            let user = await this.userRepository.findOne({where:{id:user_id}});
            if(!user){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"User Not Found"
                };
            }

            await this.userRepository.update({id:user_id},payload);

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"User Updated Successfully"
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getUserList(company_id){
        try{
            const data = await this.userRepository.find({where:{company_id:company_id}});
            if(data.length == 0){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NO_CONTENT,
                    "data":data,
                    "message":"No data found"
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "data":data
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async removeUser(id){
        try{
            const data = await this.userRepository.delete(id);
            if(data.affected){
                return {
                    "status":true,
                    "statusCode":HttpStatus.OK,
                    "message":"User Deleted Successfully"
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"User Not Found"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getUserById(id){
        try{
            const data = await this.userRepository.findOne({where:{id:id}});
            if(data){
                return {
                    "status":true,
                    "statusCode":HttpStatus.FOUND,
                    "data":data
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"User not found"
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getSuperadminList(id){
        try{

            const data = await this.userRepository.query(`
                SELECT * FROM dashboard_users where member_type = 1 AND id != ${id}
            `);

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "data":data
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getAdminList(admin_id,company_id){
        try{

            const data = await this.userRepository.query(`
                SELECT * FROM dashboard_users where member_type = 2 AND company_id = ${company_id} AND id != ${admin_id}
            `);

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "data":data
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async removeSuperadminByid(id){
        try{
            const data = await this.userRepository.query(`
              DELETE FROM dashboard_users WHERE id = ${id} AND member_type = 1
            `);
            if(data[1]){
                return {
                    "status":true,
                    "statusCode":HttpStatus.OK,
                    "message":"Super Admin Deleted Successfully"
                };
            }
            console.log(data);
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"Super Admin Not Found"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async removeAdminById(id){
        try{
            const data = await this.userRepository.query(`
              DELETE FROM dashboard_users WHERE id = ${id} AND member_type = 2
            `);
            if(data[1]){
                return {
                    "status":true,
                    "statusCode":HttpStatus.OK,
                    "message":"Admin Deleted Successfully"
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"Admin Not Found"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async updateSuperAdminPassword(payload,request){
        const auth = request.headers.authorization;
        const token  = auth.split(' ')[1];
        var decoded = await jwtDecode(token);

        try{
            if(payload.new_password.length < 6){
                return {
                    "status":false,
                    "statusCode":HttpStatus.NOT_ACCEPTABLE,
                    "message":"Password length should be more than 6 character"
                }
            }
        const superAdminCheck =  await this.dashboardUserRepository.findOne({where:{id:decoded.sub,member_type:1}});
        const isMatched = await bcrypt.compare(payload.old_password,superAdminCheck.password);

        if(!superAdminCheck){
            // return {
            //     "status":true,
            //     "statusCode":HttpStatus.NOT_FOUND,
            //     "message":"Superadmin Not Found"
            // }

            throw new HttpException({
                statusCode: HttpStatus.NOT_ACCEPTABLE,
                error:"not found",
                message: 'Superadmin Not Found',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

        if(!isMatched){
            // return {
            //     "status":true,
            //     "statusCode":HttpStatus.NOT_ACCEPTABLE,
            //     "message":"Password not matched"
            // }
            throw new HttpException({
                statusCode: HttpStatus.NOT_ACCEPTABLE,
                error:"not match",
                message: 'Password not matched',
            }, HttpStatus.NOT_ACCEPTABLE);
        }

       
        let hashedPassword = await bcrypt.hashSync(payload.new_password, 13);

        await this.dashboardUserRepository.update(decoded.sub,{
            password:hashedPassword
        });

        return {
            "status":true,
            "statusCode":HttpStatus.CREATED,
            "message":"Admin Password Updated Successfully"
        };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            }; 
        }
    }


    async updateAdminPassword(payload,request){
        const auth = request.headers.authorization;
        const token  = auth.split(' ')[1];
        var decoded = await jwtDecode(token);

        try{
            if(payload.new_password.length < 6){
                return {
                    "status":false,
                    "statusCode":HttpStatus.NOT_ACCEPTABLE,
                    "message":"Password length should be more than 6 character"
                }
            }
        const superAdminCheck =  await this.dashboardUserRepository.findOne({where:{id:decoded.sub,member_type:2}});
        const isMatched = await bcrypt.compare(payload.old_password,superAdminCheck.password);

        if(!superAdminCheck){
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"Admin Not Found"
            }
        }

        if(!isMatched){
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_ACCEPTABLE,
                "message":"Password not matched"
            }
        }

       
        let hashedPassword = await bcrypt.hashSync(payload.new_password, 13);

        await this.dashboardUserRepository.update(decoded.sub,{
            password:hashedPassword
        });

        return {
            "status":true,
            "statusCode":HttpStatus.CREATED,
            "message":"Admin Password Updated Successfully"
        };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            }; 
        }
    }

    async getComapanyAdminList(){
        try{

            const data = await this.userRepository.query(`
                SELECT dashboard_users.*,companies.name as company_name,companies.address as company_address,companies.tin as company_tin
                FROM dashboard_users 
                LEFT JOIN companies ON dashboard_users.company_id = companies.id 
                WHERE dashboard_users.member_type = 2
            `);

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "data":data
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            }; 
        }
    }

    async removeCompanyAdmin(id){
        try{
            const checkAdmin = await this.dashboardUserRepository.findOne({where:{id:id,member_type:2}});
            if(!checkAdmin){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"Admin Not Found"
                }
            }

            await this.dashboardUserRepository.delete(id);

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"Admin Deleted Successfully"
            };


        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            }; 
        }
    }

   

}
