import { Controller, Get, Post, Put, Delete, Body, Param, UsePipes, UseGuards, Req, UseInterceptors, UploadedFile, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor, FileFieldsInterceptor } from '@nestjs/platform-express'
import { ApiTags,ApiHeader,ApiResponse,ApiNotFoundResponse,ApiInternalServerErrorResponse,ApiBody,ApiBearerAuth, ApiConsumes, ApiExcludeEndpoint } from '@nestjs/swagger';
import { ValidationPipe } from '../shared/validation.pipe';
import { AdminAuthGuard } from '../shared/admin-auth.guard';
import { SuperAdminAuthGuard } from '../shared/superadmin-auth.guard';
import { AuthGuard } from '../shared/auth.guard';
import { UserService } from './user.service';
import { ModuleServicesService } from './module-services.service';
import { CompanyService } from './company.service';
import { CreateUserDto } from './interfaces/create-user.dto';
import { CreateServiceDto } from './interfaces/create-service.dto';
import { CreateCompanyDto } from './interfaces/create-company.dto';
import { CreateAdminDto } from './interfaces/create-admin.dto';
import { AssignServiceDto } from './interfaces/assign-company-service.dto';
import { PasswordUpdateDto } from './interfaces/password-update.dto';
import { RemoveServiceDto } from './interfaces/remove-company-service.dto';
import { UpdateUserDto } from './interfaces/update-user.dto';


@ApiHeader({
    name: 'bearer',
    description: 'Authorization Token',
  })
@ApiBearerAuth('access-token')
@Controller('api/v1/field-force/users')
export class UserController {
    constructor(
        private userService: UserService,
        private moduleServicesService: ModuleServicesService,
        private companyServcie: CompanyService
    ){}



//SERVICE
    
  @Post('/superadmin/services/create')
  @ApiTags('superadmin-service')   
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Created Service',
      type: CreateServiceDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  createServcie(@Body() payload:CreateServiceDto){
   return this.moduleServicesService.createService(payload);
  }

  @Put('/superadmin/services/update/:id')
  @ApiTags('superadmin-service')   
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Updated Service',
      type: CreateServiceDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  updateServcie(@Body() payload:CreateServiceDto,@Param('id') id:number){
   return this.moduleServicesService.updateService(payload,id);
  }

  @Get('/superadmin/services/list')
  @ApiTags('superadmin-service')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  getServiceList(){
   return this.moduleServicesService.getServiceList();
  }

  @Delete('/superadmin/services/remove/:id')
  @ApiTags('superadmin-service')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  removeService(@Param('id') id:number){
   return this.moduleServicesService.removeService(id);
  }



  //COMPANY
  @Post('/superadmin/company/create')
  @ApiTags('superadmin-comapany')   
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Created Company',
      type: CreateCompanyDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  createCompany(@Body() payload:CreateCompanyDto){
   return this.companyServcie.createCompany(payload);
  }

  @Put('/superadmin/company/update/:id')
  @ApiTags('superadmin-company')   
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'agreement_file', maxCount: 1 },
    { name: 'verification_file', maxCount: 1 },
  ]))
  updateCompany(@UploadedFiles() files,@Param('id') id:number){
   return this.companyServcie.updateCompany(files,id);
  }

  @Get('/superadmin/company/list')
  @ApiTags('superadmin-company')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  getCompanyList(){
   return this.companyServcie.getCompanyList();
  }

  @Delete('/superadmin/company/remove/:id')
  @ApiTags('superadmin-company')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  removeCompany(@Param('id') id:number){
   return this.companyServcie.removeCompany(id);
  }





  @Post('/admin/user/create')
  @ApiTags('admin-user')   
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Created User',
      type: CreateUserDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new AdminAuthGuard)
  createUser(@Body() payload:CreateUserDto){
   return this.userService.createUser(payload);
  }

  @Put('/admin/user/update/:id')
  @ApiTags('admin-user')   
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @UsePipes(new ValidationPipe())
  @UseGuards(new AdminAuthGuard)
  updateUser(@Body() payload:UpdateUserDto,@Param('id') id:number){
   return this.userService.updateUser(payload,id);
  }

  @Get('/admin/user/list/:company_id')
  @ApiTags('admin-user')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new AdminAuthGuard)
  getUserList(@Param('company_id') company_id:number){
   return this.userService.getUserList(company_id);
  }

  @Delete('/admin/user/remove/:id')
  @ApiTags('admin-user')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new AdminAuthGuard)
  removeUser(@Param('id') id:number){
   return this.userService.removeUser(id);
  }


  
  @Get('/general/user/profile/:id')
  @ApiTags('admin-user')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new AuthGuard)
  getUserById(@Param('id') id:number){
      return this.userService.getUserById(id);
  }


  //Assign Service To Company

  @Post('/superadmin/company/assign-servcie-company')
  @ApiTags('service-company')   
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Assigned Service',
      type: AssignServiceDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  assignServiceToCompany(@Body() payload:AssignServiceDto){
      return this.companyServcie.assignServiceToCompany(payload);
  }

  @Post('/superadmin/company/remove-servcie-company')
  @ApiTags('service-company')   
  @ApiResponse({ status: 200, description: 'The record has been successfully removed.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Removed Service',
      type: RemoveServiceDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  removeServiceToCompany(@Body() payload:RemoveServiceDto){
      return this.companyServcie.removeServiceFromCompany(payload);
  }


  //Make an admin
  @Post('/superadmin/company/create-company-admin')
  @ApiTags('superadmin-admin')   
  @ApiResponse({ status: 201, description: 'The record has been successfully created.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
      description: 'Created Admin',
      type: CreateAdminDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  createCompanyAdmin(@Body() payload:CreateAdminDto){
      return this.companyServcie.createCompanyAdmin(payload);
  }


  @Get('/superadmin/company/service-list/:id')
  @ApiTags('superadmin-company')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  getCompanyServiceList(@Param('id') id:number){
      return this.companyServcie.getCompanyServiceList(id);
  }

  @Get('/admin/company/service-list/:id')
  @ApiTags('admin-company')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UsePipes(new ValidationPipe())
  @UseGuards(new AdminAuthGuard())
  getAdminCompanyServiceList(@Param('id') id:number){
      return this.companyServcie.getCompanyServiceList(id);
  }



  @Get('/superadmin/list/superadmin-list/:id')
  @ApiTags('superadmin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  getSuperadminList(@Param('id') id:number){
      return this.userService.getSuperadminList(id);
  }

  @Get('/superadmin/list/admin-list')
  @ApiTags('superadmin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  getComapanyAdminList(){
      return this.userService.getComapanyAdminList();
  }

  @Delete('/superadmin/remove/admin-remove/:id')
  @ApiTags('superadmin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  removeCompanyAdmin(@Param('id') id:number){
      return this.userService.removeCompanyAdmin(id);
  }

  @Put('/superadmin/update/password-update')
  @ApiTags('superadmin')   
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
    description: 'Updated password',
    type: PasswordUpdateDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new SuperAdminAuthGuard())
  updateSuperAdminPassword(@Body() payload:PasswordUpdateDto,@Req() request){
      return this.userService.updateSuperAdminPassword(payload,request);
  }

  @Delete('/superadmin/remove/:id')
  @ApiTags('superadmin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new SuperAdminAuthGuard())
  removeSuperadminByid(@Param('id') id:number){
      return this.userService.removeSuperadminByid(id);
  }

  @Get('/admin/list/admin-list/:admin_id/:company_id')
  @ApiTags('admin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new AdminAuthGuard())
  getAdminList(@Param('admin_id') admin_id:number,@Param('company_id') company_id:number){
      return this.userService.getAdminList(admin_id,company_id);
  }

  @Delete('/admin/remove/:id')
  @ApiTags('admin')   
  @ApiResponse({ status: 200, description: 'record list'})
  @ApiResponse({ status: 403, description: 'Jwt Token Error.'})
  @ApiNotFoundResponse({description: 'Request not found'})
  @UseGuards(new AdminAuthGuard())
  removeAdminById(@Param('id') id:number){
      return this.userService.removeAdminById(id);
  }

  @Put('/admin/update/password-update')
  @ApiTags('admin')   
  @ApiResponse({ status: 200, description: 'The record has been successfully updated.'})
  @ApiResponse({ status: 403, description: 'Unauthorized.'})
  @ApiResponse({ status: 409, description: 'Data Already Exist , please use update api for update.'})
  @ApiNotFoundResponse({description: 'User not found'})
  @ApiInternalServerErrorResponse({description: 'Internal Server error.'})
  @ApiBody({
    description: 'Updated password',
    type: PasswordUpdateDto
  })
  @UsePipes(new ValidationPipe())
  @UseGuards(new AdminAuthGuard())
  updateAdminPassword(@Body() payload:PasswordUpdateDto,@Req() request){
      return this.userService.updateAdminPassword(payload,request);
  }


  







}
