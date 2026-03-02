using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace api.xraycare.Migrations
{
    /// <inheritdoc />
    public partial class AddMultiHospital : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Hospitals",
                columns: table => new
                {
                    RID = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: true),
                    Code = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Hospitals", x => x.RID);
                });

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Users",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "ScheduleConfigs",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "RepairRequests",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "Machines",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.AddColumn<int>(
                name: "HospitalId",
                table: "ChecklistRecords",
                type: "integer",
                nullable: false,
                defaultValue: 1);

            migrationBuilder.InsertData(
                table: "Hospitals",
                columns: new[] { "Name", "Code" },
                values: new object[] { "โรงพยาบาลหลัก (Default)", "DEFAULT" });

            migrationBuilder.CreateIndex(
                name: "IX_Users_HospitalId_Username",
                table: "Users",
                columns: new[] { "HospitalId", "Username" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Users_HospitalId_Username",
                table: "Users");

            migrationBuilder.DropColumn(name: "HospitalId", table: "Users");
            migrationBuilder.DropColumn(name: "HospitalId", table: "ScheduleConfigs");
            migrationBuilder.DropColumn(name: "HospitalId", table: "RepairRequests");
            migrationBuilder.DropColumn(name: "HospitalId", table: "Machines");
            migrationBuilder.DropColumn(name: "HospitalId", table: "ChecklistRecords");
            migrationBuilder.DropTable(name: "Hospitals");
        }
    }
}
