import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { CategoryModel } from "./category.model";
import { NotFoundError } from "@core/@shared/domain/errors/not-found-error";
import { Op, literal } from "sequelize";
import { CategoryModelMapper } from "./category-model-maper";
import { CategorySearchParams, CategorySearchResult, ICategoryRepository } from "@core/category/domain/category.repository";
import Category from "@core/category/domain/category.entity";
import { SortDirection } from "@core/@shared/domain/repository/search-params";

export class CategorySequelizeRepository implements ICategoryRepository {
    sortableFields: string[] = ["name", "created_at"];
    orderBy = {
        mysql: {
            name: (sort_dir: SortDirection) => literal(`binary name ${sort_dir}`), //ascii
        },
    };

    constructor(private categoryModel: typeof CategoryModel) { }

    async search(props: CategorySearchParams): Promise<CategorySearchResult> {
        const offset = (props.page - 1) * props.per_page;
        const limit = props.per_page;
        const { rows: models, count } = await this.categoryModel.findAndCountAll({
            ...(props.filter && {
                where: {
                    name: { [Op.like]: `%${props.filter}%` },
                },
            }),
            ...(props.sort && this.sortableFields.includes(props.sort)
                ? //? { order: [[props.sort, props.sort_dir]] }
                { order: this.formatSort(props.sort, props.sort_dir) }
                : { order: [['created_at', 'desc']] }),
            offset,
            limit,
        });
        return new CategorySearchResult({
            items: models.map((model) => {
                return CategoryModelMapper.toEntity(model);
            }),
            current_page: props.page,
            per_page: props.per_page,
            total: count,
        });
    }


    async insert(entity: Category): Promise<void> {
        const model = CategoryModelMapper.toModel(entity);
        await this.categoryModel.create(model.toJSON());
    }

    async bulkInsert(entities: Category[]): Promise<void> {
        const models = entities.map((model) =>
            CategoryModelMapper.toModel(model).toJSON());
        await this.categoryModel.bulkCreate(models);
    }

    async update(entity: Category): Promise<void> {
        const id = entity.category_id.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }

        const modelToUpdate = CategoryModelMapper.toModel(entity);

        await this.categoryModel.update(
            modelToUpdate.toJSON(),
            { where: { category_id: id } });
    }

    async delete(entityId: Uuid): Promise<void> {
        const id = entityId.id;
        const model = await this._get(id);
        if (!model) {
            throw new NotFoundError(id, this.getEntity());
        }
        await this.categoryModel.destroy({ where: { category_id: id } });
    }

    async findById(entityId: Uuid): Promise<Category | null> {
        const model = await this._get(entityId.id);
        return model ? CategoryModelMapper.toEntity(model) : null;
    }

    async findAll(): Promise<Category[]> {
        const models = await this.categoryModel.findAll();
        return models.map((category) => CategoryModelMapper.toEntity(category));
    }

    private async _get(id: string) {
        return await this.categoryModel.findByPk(id);
    }

    private formatSort(sort: string, sort_dir: SortDirection) {
        const dialect = this.categoryModel.sequelize.getDialect() as 'mysql';
        if (this.orderBy[dialect] && this.orderBy[dialect][sort]) {
            return this.orderBy[dialect][sort](sort_dir);
        }
        return [[sort, sort_dir]];
    }

    getEntity(): new (...args: any[]) => Category {
        return Category;
    }
}