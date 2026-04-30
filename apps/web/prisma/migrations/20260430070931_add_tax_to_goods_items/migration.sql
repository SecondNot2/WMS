-- AlterTable
ALTER TABLE "goods_issue_items" ADD COLUMN     "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "goods_issues" ADD COLUMN     "subtotalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxTotalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "goods_receipt_items" ADD COLUMN     "taxAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxRate" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "goods_receipts" ADD COLUMN     "subtotalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0,
ADD COLUMN     "taxTotalAmount" DECIMAL(15,2) NOT NULL DEFAULT 0;
