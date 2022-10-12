import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema, rules } from "@ioc:Adonis/Core/Validator";
import User from "App/Models/User";

export default class AuthController {
  public async register({ request, response }: HttpContextContract) {
    const userSchema = schema.create({
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({
          table: "users",
          column: "email",
          caseInsensitive: true,
        }),
      ]),
      name: schema.string(),
      phone: schema.string({ trim: true }, [rules.mobile()]),
      password: schema.string({}, [rules.minLength(8)]),
    });

    const data = await request.validate({ schema: userSchema });
    const { email, name, phone, role_id } = await User.create(data);

    return response.status(201).json({
      msg: "successfuly user registered",
      data: {
        email,
        name,
        phone,
        role_id,
      },
      errors: [],
    });
  }

  public async login({ request, response, auth }: HttpContextContract) {
    const loginSchema = schema.create({
      email: schema.string({ trim: true }, [rules.email()]),
      password: schema.string({}, [rules.minLength(8)]),
    });
    const { email, password} = await request.validate({ schema: loginSchema });

    try {
      const {token} = await auth.use('api').attempt(email, password);
      const {name, phone, role_id} = auth.user!

      const role = role_id === 1 ? 'member' : 'admin'

      return response.status(200).json({
        msg: "login successfuly",
        data: {
          token,
          email,
          name,
          phone,
          role
        },
        errors: [],
      });
    } catch (error) {
      return response.status(403).json({
        errors: [
          {
            message: "email or password is wrong",
          },
        ],
      });
    }

    // const {name,
    //   phone,
    //   role_id} =
  }

  public async logout({ response, auth }: HttpContextContract) {
    await auth.logout();

    return response.redirect().toRoute("auth.login.show");
  }
}
