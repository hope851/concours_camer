-- Preserve the existing single exam date as the written-exam date.
-- Some deployed databases already received this change outside migrations, so
-- only transform databases that still have the former `dateExam` column.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'sessionAdmission'
      AND column_name = 'dateExam'
  ) THEN
    ALTER TABLE "sessionAdmission"
      ADD COLUMN IF NOT EXISTS "dateExamEcrit" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "dateExamOral" TIMESTAMP(3);

    UPDATE "sessionAdmission"
    SET "dateExamEcrit" = "dateExam"
    WHERE "dateExamEcrit" IS NULL;

    ALTER TABLE "sessionAdmission" DROP COLUMN "dateExam";
  END IF;
END $$;
