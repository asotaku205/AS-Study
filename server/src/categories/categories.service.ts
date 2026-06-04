import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoriesStatus } from './entities/category.entity';

@Injectable()
export class CategoriesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Category)
    private readonly categoriesRepository: Repository<Category>,
  ) {}

  async onApplicationBootstrap() {
    try {
      const categoryOne = await this.categoriesRepository.findOne({ where: { id: 1 } });
      if (!categoryOne) {
        const defaultCategory = this.categoriesRepository.create({
          id: 1,
          name: 'Chung',
          slug: 'chung',
          status: CategoriesStatus.Published,
        });
        await this.categoriesRepository.save(defaultCategory);
        console.log('Successfully seeded default category: Chung (ID: 1)');
      }
    } catch (err) {
      console.error('Error seeding default category:', err);
    }
  }
  create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoriesRepository.create(createCategoryDto);
    return this.categoriesRepository.save(category);
  }

  findAll() {
    return this.categoriesRepository.find({ order: { createdAt: 'DESC' } });
  }

  findOne(id: number) {
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateCategoryDto) {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, dto);

    return await this.categoriesRepository.save(category);
  }

  async remove(id: number) {
    const category = await this.categoriesRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.categoriesRepository.remove(category);
  }
}
