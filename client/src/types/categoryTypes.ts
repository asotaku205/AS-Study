export type CategoriesStatus = 'Published' | 'Hidden';

export interface Category {
    id: number;
    name: string;
    slug: string;
    status: CategoriesStatus;
    createdAt: string;
}
   