import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    await User.createMany([
      {
        email: "admin@wediv.id",
        password: "supersecret",
        name: "Admin",
        phone: "62123123123",
        role_id: 2,
      },
      {
        email: "member@wediv.id",
        password: "supersecret",
        name: "Member",
        phone: "62123123124",
        role_id: 1,
      },
    ]);
  }
}
