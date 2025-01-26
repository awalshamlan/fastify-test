import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import routes from "./controllers/user";

const server = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();


server.listen({ port: 3000 },
    function (err, _address) {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    }
)

server.register(routes)

server.get("/", (_req, res)=>{
    res.send("Hello from fastify!")
})


export default server