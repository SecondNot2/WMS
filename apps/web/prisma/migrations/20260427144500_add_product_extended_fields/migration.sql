-- AlterTable
ALTER TABLE "products" ADD COLUMN "barcode" TEXT;
ALTER TABLE "products" ADD COLUMN "brand" TEXT;
ALTER TABLE "products" ADD COLUMN "model" TEXT;
ALTER TABLE "products" ADD COLUMN "salePrice" DECIMAL(15,2);
ALTER TABLE "products" ADD COLUMN "taxRate" DECIMAL(5,2);
ALTER TABLE "products" ADD COLUMN "location" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE INDEX "products_barcode_idx" ON "products"("barcode");
