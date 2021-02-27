import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'company_services' })
export class CompanyServiceEntity {

  @PrimaryGeneratedColumn() id:number;
  
  @Column({ type: 'integer'})
  company_id: number;

  @Column({ type: 'integer'})
  service_id: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}