using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Workout.DAL.Migrations
{
    /// <inheritdoc />
    public partial class RoutineUpdate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Routines_Users_UserId",
                table: "Routines");

            migrationBuilder.DropIndex(
                name: "IX_Routines_UserId",
                table: "Routines");

            migrationBuilder.AlterColumn<string>(
                name: "UserId",
                table: "Routines",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int")
                .Annotation("MySql:CharSet", "utf8mb4");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AlterColumn<int>(
                name: "UserId",
                table: "Routines",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_Routines_UserId",
                table: "Routines",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Routines_Users_UserId",
                table: "Routines",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
