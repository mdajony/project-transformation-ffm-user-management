import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'companies' })
export class CompanyEntity {

  @PrimaryGeneratedColumn() id:number;
  
  @Column({ type: 'varchar'})
  name: string;

  @Column({ type: 'varchar'})
  address: string;

  @Column({ type: 'varchar',default:null})
  agreement_file: string;

  @Column({ type: 'varchar',default:null})
  verification_file: string;

  @Column({ type: 'varchar'})
  tin: string;

}