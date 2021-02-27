import { Injectable, HttpException, HttpStatus, HttpService, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ServiceEntity } from './service.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { map } from 'rxjs/operators';
import { CompanyEntity } from './company.entity';
import { CompanyServiceEntity } from './company-service.entity';
import { UserEntity } from './user.entity';
import { DashboardUserEntity } from './dashboard-user.entity';
const Cloud = require('@google-cloud/storage')
const path = require('path')
const CLOUD_BUCKET = "field-force-app-images";

const fs = require("fs");
import { v4 as uuidv4 } from 'uuid';
import { log } from 'util';

const { Storage } = Cloud
const storage = new Storage({
  keyFilename: './groovy-medium-257215-caee3108960b.json',
  projectId: 'techserve4u',
})



@Injectable()
export class CompanyService {
    constructor(
        @InjectRepository(CompanyEntity) private companyRepository:Repository<CompanyEntity>,
        @InjectRepository(CompanyServiceEntity) private companyServiceRepository:Repository<CompanyServiceEntity>,
        @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
        @InjectRepository(UserEntity) private dashboardUserRepository:Repository<DashboardUserEntity>,
        private readonly httpService: HttpService
    ){}

    async createCompany(payload){
       try{
        let checkCompanyExist = await this.companyRepository.findOne({where:{name:payload.name,tin:payload.tin}});
        if(checkCompanyExist){
            return {
                "status":true,
                "statusCode":403,
                "message":"Company Already Exist"
            };
        }

        let company = new CompanyEntity();
        company.name = payload.name;
        company.address = payload.address;
        company.tin = payload.tin;
        company.address = payload.address;
        let data = await this.companyRepository.save(company);
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

    async updateCompany(files,company_id){
        try{
            let company = await this.companyRepository.findOne({where:{id:company_id}});
            if(!company){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"Company Not Found"
                };
            }

            if(files['agreement_file'] != undefined){
                const agreement_file_url = await this.uploadPdfFile(files.agreement_file[0],company_id,'agreement_file');
                console.log(agreement_file_url);
            }

            if(files['verification_file'] != undefined){
                const verification_file_url = await this.uploadPdfFile(files.verification_file[0],company_id,'verification_file');
                console.log(verification_file_url);
            }
           

            return {
                "status":true,
                "statusCode":HttpStatus.CREATED,
                "message":"Company Updated Successfully"
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getCompanyList(){
        try{
            const data = await this.companyRepository.find();
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

    async removeCompany(id){
        try{
            const data = await this.companyRepository.delete(id);
            if(data.affected){
                return {
                    "status":true,
                    "statusCode":HttpStatus.OK,
                    "message":"Company Deleted Successfully"
                };
            }
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"Company Not Found"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async assignServiceToCompany(payload){
        try{
            let checkCompanyService = await this.companyServiceRepository.find({where:{
                company_id:payload.company_id,
            }});

            let existingId = [];

            checkCompanyService.forEach(element => {
                existingId.push(element.service_id);
            });

            let service_values = [];
             payload.service_id.forEach(element => {
                 if(!existingId.includes(element)){
                    service_values.push({
                        company_id:payload.company_id,
                        service_id:element
                    })
                 }
            });

            if(service_values.length == 0){
                return {
                    "status":true,
                    "statusCode":403,
                    "message":"Services Already Assigned to this company"
                };
            }
            await this.companyServiceRepository
                                .createQueryBuilder()
                                .insert()
                                .into(CompanyServiceEntity)
                                .values(service_values)
                                .execute();
            return {
                "status":true,
                "statusCode":HttpStatus.CREATED,
                "message":"Service Assigned to company successfully"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async removeServiceFromCompany(payload){
        try{
            let checkCompanyService = await this.companyServiceRepository.findOne({where:{
                company_id:payload.company_id,
                service_id:payload.service_id
            }});
            if(!checkCompanyService){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"Service not Assingned"
                };
            }
            await this.companyServiceRepository.delete(checkCompanyService.id);
            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"Service removed from company successfully"
            };
        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }


    async createCompanyAdmin(payload){
        try{

            let checkCompanyUser = await this.dashboardUserRepository.findOne({where:{
                id:payload.user_id,
                company_id:payload.company_id,
                member_type:3
            }});
            if(!checkCompanyUser){
                return {
                    "status":true,
                    "statusCode":HttpStatus.NOT_FOUND,
                    "message":"User Not Found"
                };
            }

            await this.dashboardUserRepository.update({id:payload.user_id},{
                member_type : 2
            });

            return {
                "status":true,
                "statusCode":HttpStatus.OK,
                "message":"User converted to admin successfully"
            };

        }catch(err){
            return {
                "status":false,
                "statusCode":HttpStatus.INTERNAL_SERVER_ERROR,
                "message":err.message
            };
        }
    }

    async getCompanyServiceList(id){
        const companyExist = await this.companyRepository.findOne(id);

        if(!companyExist){
            return {
                "status":true,
                "statusCode":HttpStatus.NOT_FOUND,
                "message":"Company Not Found"
            };
        }

        const data = await this.companyServiceRepository.query(`
        SELECT services.name as service_name,services.id as service_id
        FROM company_services 
        JOIN services   ON company_services.service_id = services.id
        WHERE company_services.company_id = ${id}`
        );

        return {
            "status":true,
            "statusCode":HttpStatus.OK,
            "data":data
        };
    }


    async uploadPdfFile(file,company_id,update_type){
            const bucket = await storage.bucket(CLOUD_BUCKET);

            const { originalname, buffer } = file
            const type = await file.mimetype.split('/')[1];
            const blob = bucket.file(update_type+'_'+uuidv4()+originalname.replace(/ /g, "_"));


            const blobStream = blob.createWriteStream({
                resumable: true,
                contentType: type,
            })
            await blobStream.on('finish', () => {
                
                log("file uploaded");
                console.log('finished');
            })
            .on('error', (err) => {
                log(`Unable to upload image, something went wrong`);
                log(err);
            })
            .end(buffer)

            if(update_type == 'agreement_file'){
                await this.companyRepository.update(company_id,{
                    agreement_file : `https://files.techserve4u.com/${blob.name}`,
                });
            }

            if(update_type == 'verification_file'){
                await this.companyRepository.update(company_id,{
                    verification_file : `https://files.techserve4u.com/${blob.name}`,
                });
            }
            
    }

}
