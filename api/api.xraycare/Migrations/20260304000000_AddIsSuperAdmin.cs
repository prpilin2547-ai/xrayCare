using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.xraycare.Migrations
{
    public partial class AddIsSuperAdmin : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsSuperAdmin",
                table: "Users",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.Sql("UPDATE \"Users\" SET \"IsSuperAdmin\" = true WHERE \"Username\" = 'Superadmin';");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "IsSuperAdmin", table: "Users");
        }
    }
}
