import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { getUserProfile, login, registerUser, type TokenPayload, UserInputDTO, UserOutputDTO, validateToken } from "../models/user.model";
import { Type, type TypeBoxTypeProvider } from "@fastify/type-provider-typebox";


async function routes(server: FastifyInstance, _opts: FastifyServerOptions) {
    // type providers do not propogate globally: see https://fastify.dev/docs/latest/Reference/Type-Providers/#scoped-type-provider
    server.withTypeProvider<TypeBoxTypeProvider>().post("/register", { schema: { body: UserInputDTO, response: { 200: UserOutputDTO } } }, async (req, res) => {
        const input = req.body;
        const user = await registerUser(input);
        res.status(200);
        res.send(user);
    })

    server.withTypeProvider<TypeBoxTypeProvider>().post("/signin", { schema: { body: UserInputDTO, response: { 200: { token: Type.String() } } } }, async (req, res) => {
        const input = req.body;
        try {
            const token = await login(input);
            res.status(200);
            res.send({ token });
        } catch (err) {
            res.status(401);
            res.send(err);
        }
    })


    server.withTypeProvider<TypeBoxTypeProvider>().get("/profile",
        {
            schema:
            {
                request: {
                    headers:
                        { token: Type.String() }
                }, response: { 200: UserOutputDTO }
            }
        },
        async (req, res) => {
            // TODO: move this auth to a middleware
            // auth start
            const token = req.headers.token
            if (!token || typeof (token) !== "string") {
                res.status(401);
                return res.send();
            }
            let tokenPayload: TokenPayload
            try {
                tokenPayload = validateToken(token)
            } catch (err) {
                res.status(401);
                return res.send();
            };
            // auth end
            const user = await getUserProfile(tokenPayload.id);
            res.status(200);
            res.send(user);
        })
}

export default routes;