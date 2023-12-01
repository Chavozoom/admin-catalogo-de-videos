import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import Category from "./category.entity";
import { SearchParams } from "@core/@shared/domain/repository/search-params";
import { SearchResult } from "@core/@shared/domain/repository/search-result";
import { ISearchableRepository } from "@core/@shared/domain/repository/repository-interface";

export interface ICategoryRepository
    extends ISearchableRepository<
        Category,
        Uuid,
        CategoryFilter,
        CategorySearchParams,
        CategorySearchResult
    > { }

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter>{ }

export class CategorySearchResult extends SearchResult<Category>{ }