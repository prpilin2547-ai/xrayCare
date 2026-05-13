using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.xraycare.Migrations
{
    /// <inheritdoc />
    public partial class SyncPendingModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // DB ที่ยังไม่มีตาราง (หรือ migration AddHospitalUiStates ยังไม่รัน) จะไม่ล้ม
            migrationBuilder.Sql("""
                DO $EF$
                BEGIN
                  IF EXISTS (
                    SELECT 1 FROM pg_catalog.pg_class c
                    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                    WHERE n.nspname = 'public' AND c.relname = 'HospitalUiStates' AND c.relkind = 'r'
                  ) THEN
                    UPDATE "HospitalUiStates" SET "JsonData" = '' WHERE "JsonData" IS NULL;
                    ALTER TABLE "HospitalUiStates" ALTER COLUMN "JsonData" SET NOT NULL;
                    ALTER TABLE "HospitalUiStates" ALTER COLUMN "JsonData" SET DEFAULT '';
                  END IF;
                END $EF$;
                """);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                DO $EF$
                BEGIN
                  IF EXISTS (
                    SELECT 1 FROM pg_catalog.pg_class c
                    JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
                    WHERE n.nspname = 'public' AND c.relname = 'HospitalUiStates' AND c.relkind = 'r'
                  ) THEN
                    ALTER TABLE "HospitalUiStates" ALTER COLUMN "JsonData" DROP DEFAULT;
                    ALTER TABLE "HospitalUiStates" ALTER COLUMN "JsonData" DROP NOT NULL;
                  END IF;
                END $EF$;
                """);
        }
    }
}
