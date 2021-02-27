import { Injectable, HttpException, HttpStatus, HttpService, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs/operators';


@Injectable()
export class ModuleServicesService {
    constructor(
        @InjectRepository(ServiceEntity) private servcieRepository:Repository<ServiceEntity>,
        private readonly httpService: HttpService
    ){}

    async createService(payload){
       try{
        let checkServiceExist = await this.servcieRepository.findOne({where:{name:payload.name}});
        if(checkServiceExist){
            return {
                "status":true,
                "statusCode":403,
                "message":"Service Already Exist"
            };
        }
        let service = new ServiceEntity();
        service.name = payload.name;
        service.service_type = payload.service_type;
        let data = await this.servcieRepository.save(service);
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

    async updateService(payload,service_id){
        try{
            let servcie = await this.servcieRepository.findOne({where:{id:service_id}});
            if(!servcie){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"Service Not Found"
                };
            }

            await this.servcieRepository.update({id:service_id},payload);

            return {
                "status":true,
                "statusCode":HttpStatus.CREATED,
                "message":"Service Updated Successfully"
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getServiceList(){
        try{
            const data = await this.servcieRepository.find();
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

    async removeService(id){
        try{
            const data = await this.servcieRepository.delete(id);
            if(data.affected){
                return {
                    "status":true,
                    "statusCode":HttpStatus.OK,
                    "message":"Service Deleted Successfully"
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"Service Not Found"
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
