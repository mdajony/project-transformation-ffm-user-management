import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'services' })
export class ServiceEntity {

  @PrimaryGeneratedColumn() id:number;
  
  @Column({ type: 'varchar'})
  name: string;

  @Column({ type: 'varchar',default:null})
  service_type: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}