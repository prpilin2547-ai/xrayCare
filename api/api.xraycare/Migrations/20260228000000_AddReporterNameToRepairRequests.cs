using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.xraycare.Migrations
{
    /// <inheritdoc />
    public partial class AddReporterNameToRepairRequests : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ReporterName",
                table: "RepairRequests",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReporterName",
                table: "RepairRequests");
        }
    }
}
