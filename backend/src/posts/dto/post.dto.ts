/*
 * @Descripttion : 
 * @Author       : wuhaidong
 * @Date         : 2023-05-12 12:20:12
 * @LastEditors  : wuhaidong
 * @LastEditTime : 2023-08-10 17:05:48
 */
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题' })
  @IsNotEmpty({ message: '文章标题必填' })
  readonly title: string;

  @ApiPropertyOptional({ description: '内容' })
  readonly content: string;

  @ApiPropertyOptional({ description: '文章封面' })
  readonly coverUrl: string;

  @ApiPropertyOptional({ description: '文章状态' })
  readonly status: string;

  @ApiProperty({ description: '文章分类' })
  readonly category: string;

  @ApiPropertyOptional({ description: '是否推荐' })
  readonly isRecommend: boolean;

  @ApiPropertyOptional({ description: '文章标签' })
  readonly tag: string;
}

export class PostInfoDto {
  public id: number;
  public title: string;
  public content: string;
  public contentHtml: string;
  public summary: string;
  public toc: string;
  public coverUrl: string;
  public isRecommend: boolean;
  public status: string;
  public userId: string;
  public author: string;
  public category: string;
  public tags: string[];
  public count: number;
  public likeCount: number;
}

export interface PostsRo {
  list: PostInfoDto[];
  count: number;
}
