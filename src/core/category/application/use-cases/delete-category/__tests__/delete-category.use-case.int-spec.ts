import { setupSequelize } from "@core/@shared/infra/testing/helper";
import { Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "@core/@shared/domain/errors/not-found-error";
import { DeleteCategoryUseCase } from "../delete-category.use-case";
import { CategorySequelizeRepository } from "@core/category/infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "@core/category/infra/db/sequelize/category.model";
import Category from "@core/category/domain/category.entity";

describe("DeleteCategoryUseCase Integration Tests", () => {
    let useCase: DeleteCategoryUseCase;
    let repository: CategorySequelizeRepository;

    setupSequelize({ models: [CategoryModel] });

    beforeEach(() => {
        repository = new CategorySequelizeRepository(CategoryModel);
        useCase = new DeleteCategoryUseCase(repository);
    });

    it("should throws error when entity not found", async () => {
        const uuid = new Uuid();
        await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
            new NotFoundError(uuid.id, Category)
        );
    });

    it("should delete a category", async () => {
        const category = Category.fake().aCategory().build();
        await repository.insert(category);
        await useCase.execute({
            id: category.category_id.id,
        });
        await expect(repository.findById(category.category_id)).resolves.toBeNull();
    });
});