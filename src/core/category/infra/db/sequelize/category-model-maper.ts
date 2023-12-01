import { CategoryModel } from "./category.model";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { EntityValidationError } from "@core/@shared/domain/validators/validation.error";
import Category from "@core/category/domain/category.entity";

export class CategoryModelMapper {
    static toModel(entitiy: Category): CategoryModel {
        return CategoryModel.build({
            category_id: entitiy.category_id.id,
            name: entitiy.name,
            description: entitiy.description,
            is_active: entitiy.is_active,
            created_at: entitiy.created_at
        });
    };
    static toEntity(model: CategoryModel): Category {
        const entitiy = new Category({
            category_id: new Uuid(model.category_id),
            name: model.name,
            description: model.description,
            is_active: model.is_active,
            created_at: model.created_at
        });
        entitiy.validate();
        if (entitiy.notification.hasErrors()) {
            throw new EntityValidationError(entitiy.notification.toJSON());
        }
        return entitiy;
    }
}