using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.xraycare.Migrations
{
    /// <summary>
    /// Ensures Machines.Status and Machines.StatusDateKey exist (idempotent).
    /// Safe if <see cref="MachineDailyChecklistStatus"/> already applied or partially failed.
    /// </summary>
    public partial class EnsureMachinesChecklistStatusColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("""
                ALTER TABLE "Machines" ADD COLUMN IF NOT EXISTS "Status" integer NOT NULL DEFAULT 0;
                ALTER TABLE "Machines" ADD COLUMN IF NOT EXISTS "StatusDateKey" text NULL;
                """);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Leave columns in place: they may have been introduced by 20260513120000_MachineDailyChecklistStatus.
        }
    }
}
