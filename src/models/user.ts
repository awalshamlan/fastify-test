import UserDTO from "./user.dto";

class User{

    userid: number

    constructor(userid: number){
        this.userid = userid
    }

    static login():User{
        // login the user
        return new User(1);
    }

    static register(input: UserDTO): User{
        // register the user
        return new User(1);
    }
}
export default User