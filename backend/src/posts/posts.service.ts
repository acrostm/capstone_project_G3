import { CategoryService } from '../category/category.service';
import { CreatePostDto, PostInfoDto, PostsRo } from './dto/post.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { PostsEntity } from './entities/post.entity';
import { TagService } from '../tag/tag.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostsEntity)
    private readonly postsRepository: Repository<PostsEntity>,
    private readonly categoryService: CategoryService,
    private readonly tagService: TagService,
  ) {}

  async create(user, post: CreatePostDto): Promise<number> {
    const { title } = post;
    if (!title) {
      throw new HttpException('need post title', HttpStatus.BAD_REQUEST);
    }

    const doc = await this.postsRepository.findOne({
      where: { title },
    });
    if (doc) {
      throw new HttpException('post already exist', HttpStatus.BAD_REQUEST);
    }

    const { tag, category = 0, status, isRecommend, coverUrl } = post;

    const categoryDoc = await this.categoryService.findById(category);

    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const postParam: Partial<PostsEntity> = {
      ...post,
      isRecommend: isRecommend ? 1 : 0,
      category: categoryDoc,
      tags: tags,
      author: user,
      coverUrl: coverUrl || 'https://r2.3cap.xyz/6ptvnssij7ipowovndrhch3x1.jpg',
    };
    if (status === 'publish') {
      Object.assign(postParam, {
        publishTime: new Date(),
      });
    }

    const newPost: PostsEntity = this.postsRepository.create({
      ...postParam,
    });
    const created = await this.postsRepository.save(newPost);
    return created.id;
  }

  async findAll(query: {
    [x: string]: any;
    pageNum?: 1;
    pageSize?: 10;
  }): Promise<PostsRo> {
    const qb: SelectQueryBuilder<PostsEntity> = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user')
      .orderBy('post.updateTime', 'DESC');
    qb.where('1 = 1');
    qb.orderBy('post.create_time', 'DESC');

    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    const result: PostInfoDto[] = posts.map((item) => item.toResponseObject());
    return { list: result, count: count };
  }

  async findById(id): Promise<any> {
    const qb = this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.category', 'category')
      .leftJoinAndSelect('post.tags', 'tag')
      .leftJoinAndSelect('post.author', 'user')
      .where('post.id=:id')
      .setParameter('id', id);

    const result = await qb.getOne();
    if (!result)
      throw new HttpException(
        `post id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    await this.postsRepository.update(id, { count: result.count + 1 });

    return result.toResponseObject();
  }

  async updateById(id, post): Promise<number> {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(
        `post id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const { category, tag, status } = post;
    const tags = await this.tagService.findByIds(('' + tag).split(','));
    const categoryDoc = await this.categoryService.findById(category);
    const newPost = {
      ...post,
      isRecommend: post.isRecommend ? 1 : 0,
      category: categoryDoc,
      tags,
      publishTime: status === 'publish' ? new Date() : existPost.publishTime,
    };

    const updatePost = this.postsRepository.merge(existPost, newPost);
    return (await this.postsRepository.save(updatePost)).id;
  }

  async updateViewById(id) {
    const post: PostsEntity = await this.postsRepository.findOne(id);
    const updatePost: PostsEntity = this.postsRepository.merge(post, {
      count: post.count + 1,
    });
    this.postsRepository.save(updatePost);
  }

  async getArchives() {
    return await this.postsRepository
      .createQueryBuilder('post')
      .select([`DATE_FORMAT(update_time, '%Y年%m') time`, `COUNT(*) count`])
      .where('status=:status', { status: 'publish' })
      .groupBy('time')
      .orderBy('update_time', 'DESC')
      .getRawMany();
  }

  async getArchiveList(time) {
    return await this.postsRepository
      .createQueryBuilder('post')
      .where('status=:status', { status: 'publish' })
      .andWhere(`DATE_FORMAT(update_time, '%Y年%m')=:time`, { time: time })
      .orderBy('update_time', 'DESC')
      .getRawMany();
  }

  async remove(id) {
    const existPost = await this.postsRepository.findOne(id);
    if (!existPost) {
      throw new HttpException(
        `post id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.postsRepository.remove(existPost);
  }
}
