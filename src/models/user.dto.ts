import {Type, type Static} from "@sinclair/typebox"

export const UserDTOType = Type.Object({
    email: Type.String(),
    password: Type.String(),
})

type UserDTO = {
    email: string
    password: string
}

export default UserDTO;