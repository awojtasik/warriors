import { ValidationError } from '../utils/errors';
import { v4 as uuid } from 'uuid';
import { pool } from '../utils/db';
import { FieldPacket } from 'mysql2';

type WarriorRecordResults = [WarriorRecord[], FieldPacket[]];

export class WarriorRecord {
  public id?: string;
  public readonly name: string;
  public readonly power: number;
  public readonly defence: number;
  public readonly stamina: number;
  public readonly agility: number;
  public wins?: number;

  constructor(obj: Omit<WarriorRecord, 'insert' | 'update'>) {
    const { id, name, power, defence, stamina, agility, wins } = obj;

    const stats = [power, defence, stamina, agility];

    const sum = stats.reduce((prev, curr) => prev + curr, 0);

    for (const stat of stats) {
      if (stat < 1) {
        throw new ValidationError(
          'Kada ze statystyk musi wynosić min. 1. Ta zasada została złamama'
        );
      }
    }

    if (sum !== 10) {
      throw new ValidationError(
        `Suma wszystkich statystyk musi wynosić 10. Aktualnie jest to ${sum}.`
      );
    }
    if (name.length < 3 && name.length > 50) {
      throw new ValidationError(
        `Imię musi posiadać od 3 do 50 znaków. Aktualnie jest to ${name.length} znaków.`
      );
    }
    this.id = id ?? uuid();
    this.name = name;
    this.power = power;
    this.defence = defence;
    this.stamina = stamina;
    this.agility = agility;
    this.wins = wins ?? 0;
  }

  async insert(): Promise<string> {
    await pool.execute(
      'INSERT INTO `warriors`(`id`, `name`, `power`, `defence`, `stamina`, `agility`, `wins`) VALUES (:id, :name, :power, :defence, :stamina, :agility, :wins)',
      {
        id: this.id,
        name: this.name,
        power: this.power,
        defence: this.defence,
        stamina: this.stamina,
        agility: this.agility,
        wins: this.wins,
      }
    );
    return this.id;
  }
  async update(): Promise<void> {
    await pool.execute(
      'Update `warriors` SET `wins` = :wins WHERE `id` = :id',
      {
        id: this.id,
        wins: this.wins,
      }
    );
  }
  static async getOne(id: string): Promise<WarriorRecord | null> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` WHERE `id` = :id',
      {
        id,
      }
    )) as WarriorRecordResults;
    return results.length === 0 ? null : new WarriorRecord(results[0]);
  }

  static async listAll(): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors`'
    )) as WarriorRecordResults;
    return results.map((obj) => new WarriorRecord(obj));
  }
  static async listTop(topCount: number): Promise<WarriorRecord[]> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` ORDER BY `wins` DESC LIMIT :topCount',
      {
        topCount,
      }
    )) as WarriorRecordResults;
    return results.map((obj) => new WarriorRecord(obj));
  }
  static async isNameTaken(name: string): Promise<boolean> {
    const [results] = (await pool.execute(
      'SELECT * FROM `warriors` WHERE `name` = :name',
      {
        name,
      }
    )) as WarriorRecordResults;
    return results.length > 0;
  }
}
