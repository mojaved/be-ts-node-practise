import { UserCredentialDBAccess } from "../src/Authorization/UserCredentialDBAccess";
import { WorkingPosition } from "../src/Shared/Model";
import { UserDbAccess } from "../src/User/UserDbAccess";

class DbTest {
    public dbAccess: UserCredentialDBAccess = new UserCredentialDBAccess();
    public dbUser: UserDbAccess = new UserDbAccess();
}

new DbTest().dbAccess.putUserCredentials({
    username: 'user2',
    password: 'password2',
    accessRights: [0, 1, 2, 3]
})

// new DbTest().dbUser.putUser({
//     id: '1001',
//     name: 'Muhammad',
//     age: 30,
//     email: 'dev.muhammadomer@gmail.com',
//     workingPosition: WorkingPosition.EXPERT
// })