import server from "..";
import User from "../models/user";
import UserDTO from "../models/user.dto";

server.post("/register", (req, res)=>{
    const input:UserDTO = req.body();

    input.email;
    input.password;

    User.register(input);
})