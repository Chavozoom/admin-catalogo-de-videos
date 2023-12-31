import { SortDirection } from "@core/@shared/domain/repository/search-params";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { InMemorySearchableRepository } from "@core/@shared/infra/db/in-memory/in-memory-repository";
import Category from "@core/category/domain/category.entity";
import { CategoryFilter, ICategoryRepository } from "@core/category/domain/category.repository";

export class CategoryInMemoryRepository
    extends InMemorySearchableRepository<Category, Uuid>
    implements ICategoryRepository {
    sortableFields: string[] = ["name", "created_at"];

    protected async applyFilter(items: Category[], filter: CategoryFilter
    ): Promise<Category[]> {
        if (!filter) {
            return items;
        }

        return items.filter((i) => {
            return (
                i.name.toLowerCase().includes(filter.toLowerCase())
            );
        });
    };
    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
    protected applySort(items: Category[], sort: string | null,
        sort_dir: SortDirection | null,
    ) {
        return sort ? super.applySort(items, sort, sort_dir) : super.applySort(items, "created_at", "desc");
    }
} 