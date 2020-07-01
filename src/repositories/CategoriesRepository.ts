import { EntityRepository, Repository } from 'typeorm';

import Category from '../models/Category';

@EntityRepository(Category)
class CategoriesRepository extends Repository<Category> {
  public async checkExistentCategory(categoryTitle: string): Promise<string> {
    // Find category on database by name
    const findCategory = await this.findOne({
      where: { title: categoryTitle },
    });

    // If that category doesn't exist, create it
    if (!findCategory) {
      const newCategory = this.create({
        title: categoryTitle,
      });

      // Save new category on database
      await this.save(newCategory);

      // Return to the transactions repo the newly created category id
      return newCategory.id;
    }

    // The category already existed, so just return its id
    return findCategory.id;
  }
}

export default CategoriesRepository;
