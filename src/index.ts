import Fastify from "fastify";

const server = Fastify({
    logger: true
});


server.listen({ port: 3000 },
    function (err, address) {
        if (err) {
            server.log.error(err);
            process.exit(1);
        }
    }
)


export default server