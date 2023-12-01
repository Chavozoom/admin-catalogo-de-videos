import { CategoryInMemoryRepository } from "@core/category/infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../create-category.use-case";

describe('CreateCategoryUseCase Unit Tests', () => {
    let useCase: CreateCategoryUseCase;
    let repository: CategoryInMemoryRepository;

    beforeEach(() => {
        repository = new CategoryInMemoryRepository();
        useCase = new CreateCategoryUseCase(repository);
    });

    it("should create a category", async () => {
        const spyInsert = jest.spyOn(repository, "insert");
        let output = await useCase.execute({ name: "test" });
        expect(spyInsert).toHaveBeenCalledTimes(1);

        expect(output).toStrictEqual({
            id: repository.entityArray[0].category_id.id,
            name: "test",
            description: null,
            is_active: true,
            created_at: repository.entityArray[0].created_at
        });

        output = await useCase.execute({
            name: "another test",
            description: "test desc",
            is_active: false
        });

        expect(spyInsert).toHaveBeenCalledTimes(2);

        expect(output).toStrictEqual({
            id: repository.entityArray[1].category_id.id,
            name: "another test",
            description: "test desc",
            is_active: false,
            created_at: repository.entityArray[1].created_at
        });
    });
});