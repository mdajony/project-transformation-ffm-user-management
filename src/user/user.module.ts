import { Module, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';


import { UserController } from './user.controller';

import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { ModuleServicesService } from './module-services.service';
import { ServiceEntity } from './service.entity';
import { CompanyEntity } from './company.entity';
import { CompanyService } from './company.service';
import { CompanyServiceEntity } from './company-service.entity';
import { DashboardUserEntity } from './superadmin.entity';

@Module({
    imports:[TypeOrmModule.forFeature([
        UserEntity,
        ServiceEntity,
        CompanyEntity,
        CompanyServiceEntity,
        DashboardUserEntity
    ]),HttpModule],
    controllers:[UserController],
    providers:[UserService,ModuleServicesService,CompanyService]
})
export class UserModule {

}
