<div align="center" width="100%">
    <img 
         src="https://media.discordapp.net/attachments/811964301669695550/965400192704712715/Group_13.png?width=1440&height=362" 
         alt="ReplitAuth logo" 
         width="70%"
    />
    <h1>The best solution for authenticating users with Replit</h1>
</div>

## Why?
As of this commit, this project is the only practical solution for Replit user authentication.
This is because the official Replit solution only returns public information about an authenticated user. 
If only this is used to verify a user, 
it would be trivial to pose as another user by submitting another user's info, as it is public.
In order to build a practical, robust and secure authentication system, some sort of secret information must be used, that only the original 
authenticated client and the authentication server know. This is what the `sessionToken` field in the login response body stands to solve. 
By including this secret information in subsequent communications with the authentication server, each request can essentially be linked 
to the original authention, verifying that the user is who they say they are.

## Usage guide

### Login
Initially, direct the user to 
[`https://login.replitauth.com`](https://login.replitauth.com), 
where they will be prompted to log into their Replit account.

After the user logs in to their Replit account, a message is sent 
to the window that opened the login window.
The message contains data about the user that was just authenticated.

The minimal code for login handling is below;
```javascript
function login() {
    window.addEventListener("message", authComplete);

    const authWindow = window.open("https://login.replitauth.com");

    function authComplete(msg) {
        window.removeEventListener("message", authComplete);
        authWindow.close();

        console.log(msg.data);
    } 
}
```

Upon a successful authentication, `msg.data` will contain the following data:

| Name            | Type       | Description                                  |
| :-------------- | :--------- | :------------------------------------------- |
| `success`       | `boolean`  | Whether the authentication was success       |
| `sessionToken`  | `string`   | The session token                            |
| `replit.name`   | `string`   | The username of the user                     |
| `replit.avatar` | `string`   | A URL pointing to the user's profile picture |
| `replit.uid`    | `integer`  | The unique account identifier of the user    |
| `replit.roles`  | `[string]` | The roles belonging to the user              |
| `replit.teams`  | `[string]` | The teams the user is in                     |

For example:
```json
{
    "success": true,
    "sessionToken": "3f9108e6-62e1-49c7-8ce4-d691903fafe",
    "replit": {
        "name": "johndoe",
        "avatar": "https://storage.googleapis.com/replit/images/0123456789_0123456789abcdef.png"
        "uid": "1234567",
        "roles": ["Role1", "Role2"],
        "teams": ["Team1", "Team2", "Team3"]
    }
}
```

<!-- TODO: Add user validation section -->

---

## Something to think about
Although I guarantee the published source code to be identical to that of the code deployed in the relevant production channels for this project, 
there is no basis on which to trust my word. Although no part of this project comes into contact at any point with sensitive user credentials,
it could still be considered a sensitive part in a project or product utilising it. 
Like any other zero-trust system, there is no hard, absolute basis on which to verify my claims.

As a final note, to inform, it is entirely possible for those with database access to access authentication tokens for any currently signed-in user. 
This could then be used to authenticate requests to the project the authentication was originally used for, posing as the original user.
If a database does not store its information to a suitably encrypted degree, any database manager can access the information stored within.

As of this commit, I ([Malted](https://github.com/ma1ted)) am the only person with access to this database. Any changes to this will be 
reflected in this README accordingly. 

While it goes without saying I will, under no circumstances, access
data within this database without going through the same channels as every other user of this project, this claim can not be absolutely trusted.

If you're bothered by my ability to access information, please feel free to self-host this project.

## Notice of Non-Affiliation and Disclaimer
[ReplitAuth](https://github.com/ma1ted/replitauth) or its creator, [Malted](https://github.com/ma1ted), is not affiliated, associated, authorized, endorsed by, or in any way officially connected with Replit, 
or any of its subsidiaries or its affiliates. The official Replit website can be found at [https://replit.com](https://replit.com).

The name Replit as well as related names, marks, emblems and images are registered trademarks of their respective owners.

