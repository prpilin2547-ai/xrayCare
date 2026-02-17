using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace api.xraycare.Migrations
{
    /// <inheritdoc />
    public partial class AddMachineFields : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Room",
                table: "Machines",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Register_date",
                table: "Machines",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Caretaker",
                table: "Machines",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(name: "Room", table: "Machines");
            migrationBuilder.DropColumn(name: "Register_date", table: "Machines");
            migrationBuilder.DropColumn(name: "Caretaker", table: "Machines");
        }
    }
}
