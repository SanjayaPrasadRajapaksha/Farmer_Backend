import { jest } from "@jest/globals";

const destroyMock = jest.fn();
const uploadMock = jest.fn();
const findByIdMock = jest.fn();
const deleteByIdMock = jest.fn();
const uploadImageRepoMock = jest.fn();

jest.unstable_mockModule("../config/cloudinary.js", () => ({
  default: {
    uploader: {
      destroy: destroyMock,
      upload: uploadMock,
    },
  },
}));

jest.unstable_mockModule("../repositories/product.repo.js", () => ({
  default: {
    findById: findByIdMock,
    deleteById: deleteByIdMock,
    uploadImage: uploadImageRepoMock,
  },
}));

const { default: ProductService } = await import("../services/product.service.js");

describe("ProductService.deleteById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deletes cloudinary image when product has public_id", async () => {
    findByIdMock.mockResolvedValue({ id: 123, public_id: "farmer_product_images/abc123" });
    deleteByIdMock.mockResolvedValue(1);
    destroyMock.mockResolvedValue({ result: "ok" });

    const result = await ProductService.deleteById(123);

    expect(destroyMock).toHaveBeenCalledTimes(1);
    expect(destroyMock).toHaveBeenCalledWith("farmer_product_images/abc123");
    expect(deleteByIdMock).toHaveBeenCalledWith(123);
    expect(result).toBe(1);
  });

  test("does not call cloudinary when product has no public_id", async () => {
    findByIdMock.mockResolvedValue({ id: 123, public_id: null });
    deleteByIdMock.mockResolvedValue(1);

    const result = await ProductService.deleteById(123);

    expect(destroyMock).not.toHaveBeenCalled();
    expect(deleteByIdMock).toHaveBeenCalledWith(123);
    expect(result).toBe(1);
  });
});

describe("ProductService.uploadImage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("deletes old image then uploads new image", async () => {
    findByIdMock.mockResolvedValue({ id: 10, public_id: "farmer_product_images/old" });
    destroyMock.mockResolvedValue({ result: "ok" });
    uploadMock.mockResolvedValue({
      public_id: "farmer_product_images/new",
      secure_url: "https://res.cloudinary.com/x/image/upload/v1/farmer_product_images/new.jpg",
    });
    uploadImageRepoMock.mockResolvedValue([1]);

    const res = await ProductService.uploadImage(10, "BASE64", "image/jpeg");

    expect(destroyMock).toHaveBeenCalledWith("farmer_product_images/old");
    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(uploadImageRepoMock).toHaveBeenCalledWith(
      10,
      "farmer_product_images/new",
      "https://res.cloudinary.com/x/image/upload/v1/farmer_product_images/new.jpg"
    );
    expect(res.status).toBe(true);
  });

  test("uploads new image when no old image exists", async () => {
    findByIdMock.mockResolvedValue({ id: 11, public_id: null });
    uploadMock.mockResolvedValue({
      public_id: "farmer_product_images/new2",
      secure_url: "https://res.cloudinary.com/x/image/upload/v1/farmer_product_images/new2.jpg",
    });
    uploadImageRepoMock.mockResolvedValue([1]);

    const res = await ProductService.uploadImage(11, "BASE64", "image/jpeg");

    expect(destroyMock).not.toHaveBeenCalled();
    expect(uploadMock).toHaveBeenCalledTimes(1);
    expect(uploadImageRepoMock).toHaveBeenCalledWith(
      11,
      "farmer_product_images/new2",
      "https://res.cloudinary.com/x/image/upload/v1/farmer_product_images/new2.jpg"
    );
    expect(res.status).toBe(true);
  });
});
