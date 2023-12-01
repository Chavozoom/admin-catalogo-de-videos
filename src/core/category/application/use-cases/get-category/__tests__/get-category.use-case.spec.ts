import { InvalidUuidError, Uuid } from "@core/@shared/domain/value-objects/uuid.vo";
import { NotFoundError } from "@core/@shared/domain/errors/not-found-error";
import { GetCategoryUseCase } from "../get-category.use-case";
import Category from "@core/category/domain/category.entity";
import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";

describe("GetCategoryUseCase Unit Tests", () => {
    let useCase: GetCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new GetCategoryUseCase(repository);
    });

    it("should throws error when entity not found", async () => {
        await expect(() => useCase.execute({ id: 'fake id' })).rejects.toThrow(
            new InvalidUuidError()
        );

        const uuid = new Uuid();
        await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
            new NotFoundError(uuid.id, Category)
        );
    });

    it("should returns a category", async () => {
        const items = [Category.create({ name: "Movie" })];
        repository.entityArray = items;
        const spyFindById = jest.spyOn(repository, "findById");
        const output = await useCase.execute({ id: items[0].category_id.id });
        expect(spyFindById).toHaveBeenCalledTimes(1);
        expect(output).toStrictEqual({
            id: items[0].category_id.id,
            name: "Movie",
            description: null,
            is_active: true,
            created_at: items[0].created_at,
        });
    });
});