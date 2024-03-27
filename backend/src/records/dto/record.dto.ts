import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNumber, IsString } from "class-validator";

export class DateValidate {
  @IsDate()
  @Type(() => Date)
  @ApiPropertyOptional({ description: 'date' })
  readonly date: Date;
}

export class CreateRecordDto {
  @IsNumber()
  @ApiPropertyOptional({ description: 'curls count' })
  readonly curls_count: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'squats count' })
  readonly squats_count: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'bridges count' })
  readonly bridges_count: number;

  @IsNumber()
  @ApiPropertyOptional({ description: 'score' })
  readonly score: number;

  @IsString()
  @ApiPropertyOptional({ description: 'mood' })
  readonly mood: string;
}

export class RecordDto {
  public id: number;
  public curls_count: number;
  public squats_count: number;
  public bridges_count: number;
  public score: number;
  public mood: string;
  public create_time: Date
}
