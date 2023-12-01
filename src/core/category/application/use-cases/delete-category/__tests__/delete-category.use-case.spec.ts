import { InvalidUuidError, Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { DeleteCategoryUseCase } from "../delete-category.use-case";
import { NotFoundError } from "@core/@shared/domain/errors/not-found-error";
import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import Category from "@core/category/domain/category.entity";

describe("DeleteCategoryUseCase Unit Tests", () => {
    let useCase: DeleteCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new DeleteCategoryUseCase(repository);
    });

    it("should throws error when entity not found", async () => {
        await expect(() =>
            useCase.execute({ id: "fake id" })
        ).rejects.toThrow(new InvalidUuidError());

        const uuid = new Uuid();

        await expect(() =>
            useCase.execute({ id: uuid.id })
        ).rejects.toThrow(new NotFoundError(uuid.id, Category));
    });

    it("should delete a category", async () => {
        const items = [new Category({ name: "test 1" })];
        repository.entityArray = items;
        await useCase.execute({
            id: items[0].category_id.id,
        });
        expect(repository.entityArray).toHaveLength(0);
    });
});