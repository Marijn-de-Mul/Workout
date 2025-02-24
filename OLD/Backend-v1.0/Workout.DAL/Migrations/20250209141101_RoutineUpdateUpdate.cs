using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Workout.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RoutineUpdateUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Routines_Users_UserId1",
                table: "Routines");

            migrationBuilder.DropIndex(
                name: "IX_Routines_UserId1",
                table: "Routines");

            migrationBuilder.DropColumn(
                name: "UserId1",
                table: "Routines");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserId1",
                table: "Routines",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Routines_UserId1",
                table: "Routines",
                column: "UserId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Routines_Users_UserId1",
                table: "Routines",
                column: "UserId1",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
