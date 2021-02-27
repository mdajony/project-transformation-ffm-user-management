import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity {

  @PrimaryGeneratedColumn() id:number;

  @Column({ type: 'timestamptz',default:null})
  registered_on: string;

  @Column({ type: 'varchar',default:null})
  first_name: string;

  @Column({ type: 'varchar',default:null})
  last_name: string;

  @Column({ type: 'varchar' })
  phone_number: string;

  @Column({ type: 'varchar',default:null})
  nid: string;

  @Column({ type: 'varchar',default:null})
  profile_photo: string;

  @Column({ type: 'varchar',default:null})
  email: string;

  @Column({ type: 'varchar',default:null})
  designation: string;

  @Column({ type: 'varchar',default:null})
  department: string;

  @Column({ type: 'integer' })
  member_type: number;

  @Column({ type: 'integer' })
  company_id: number;


  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}