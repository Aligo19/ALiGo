
Pour toute erreur ou manque de comprehension, merci de bien vouloir fermer les yeux et faire genre ça marche

# Api Request

    Main link :
        http://localhost:3001

## Users

### Log a player in

```http
  GET /users/${code}/login
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| code | int | Returned value when connecting through 42's OAuth, under the "code" variable in the URL, see dedicated readme |

#### Return:
Returns an object ([details](#json-user-1)) with all the user data.

```JSON
{
    "ID_19": "hgoorick",
    "Pseudo": "hgoorick",
    "Avatar": "https://cdn.intra.42.fr/users/9fe27554c75228788d283a4dc48bf60c/hgoorick.png",
    "Elo": 0,
    "Actual_skin": 0,
    "Global_skin": [],
    "Wins": 0,
    "Loses": 0,
    "ID": 9
}
```


### Update user info

```http
  PATCH /users/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Input:
Input the object ([details](#json-user-1)) after modifying the data with the one from the user's profile.

```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "LePlusBo",
    "Avatar": "NouvellePhoto",
    "Elo": 12,
    "Actual_skin": 3,
    "Global_skin": [
        1,
        2,
        3,
        4
    ],
    "Wins": 20,
    "Loses": 10
}
```

#### Return:
If the returned object ([details](#json-user-1)) is identical to the one sent, the request went correctly, if not, an error occured.


### Get all player info

```http
  GET /users/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:
Returns an object ([details](#json-user-1)) with all the user data.

```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "User",
    "Avatar": "user_avatar_url",
    "Elo": 200,
    "Actual_skin": 3,
    "Global_skin": [
        1,
        2,
        3,
        4
    ],
    "Wins": 20,
    "Loses": 10
}
```

### Add a friend

```http
  GET /users/${id}/friends/${friendName}/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |
| friendName | string | Name of the user to be added |

#### Return:
If nothing is returned, the request was successful, otherwise an error occurred.


### Block user

```http
  GET /users/${id}/block/${blockName}/add
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |
| blockName | string | Name of the user to be blocked |

#### Return:
If nothing is returned, the request was successful, otherwise an error occurred.

### TODO

Pouvoir retirer un user des amis et des blocks

-----------

## Match

### Get all match info

```http
  GET /matches/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Match id |

#### Return:
Returns an object ([Details](#json-match-1)) with all the match data.

```JSON
{
    "ID": 1,
    "Score_user1": 3,
    "Score_user2": 2,
    "Status": 1,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 100,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```

### Get all match info for a user

```http
  GET /matches/${idUser}/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:
Returns an array of objects. Each element contains the data from one match. ([Details](#json-match-1))


```JSON
[
  {
      "ID": 1,
      "Score_user1": 3,
      "Score_user2": 2,
      "Status": 1,
      "ID_user1": {
          "ID": 1,
          "ID_19": "user1_ID_19",
          "Pseudo": "User1",
          "Avatar": "user1_avatar_url",
          "Elo": 200,
          "Actual_skin": 3,
          "Global_skin": [
              1,
              2,
              3,
              4
          ],
          "Wins": 20,
          "Loses": 10
      },
      "ID_user2": {
          "ID": 2,
          "ID_19": "friend1_ID_19",
          "Pseudo": "User2",
          "Avatar": "friend1_avatar_url",
          "Elo": 100,
          "Actual_skin": 1,
          "Global_skin": [
              1,
              2,
              3
          ],
          "Wins": 10,
          "Loses": 5
      }
  },
  {
      "ID": 2,
      "Score_user1": 3,
      "Score_user2": 2,
      "Status": 1,
      "ID_user1": {
          "ID": 1,
          "ID_19": "user1_ID_19",
          "Pseudo": "User1",
          "Avatar": "user1_avatar_url",
          "Elo": 200,
          "Actual_skin": 3,
          "Global_skin": [
              1,
              2,
              3,
              4
          ],
          "Wins": 20,
          "Loses": 10
      },
      "ID_user2": {
          "ID": 2,
          "ID_19": "friend1_ID_19",
          "Pseudo": "User2",
          "Avatar": "friend1_avatar_url",
          "Elo": 100,
          "Actual_skin": 1,
          "Global_skin": [
              1,
              2,
              3
          ],
          "Wins": 10,
          "Loses": 5
      }
  }
]
```

### Start looking for a game

```http
  GET /matches/${id}/search
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user looking for a game |

#### Return:
Returns an object ([details](#json-match-1)) with all the match data.
Two possible scenarios:
1. the status is 0, then the game has just been created an Player 1 is waiting for Player 2
2. the status is 1, then both players are connected and the game can start

```JSON
{
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": null,
    "Score_user1": 0,
    "Score_user2": 0,
    "Status": 0,
    "ID": 33
}
```

### End a game

```http
  POST /matches/end
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| - | - | - |

#### Input:
an object with the match id and score, the players' data will automatically be updated in the DB.

```JSON
{
  "Score_user1" : 1,
  "Score_user2" : 3,
  "Id": 33
}
```


#### Return:
Returns an object ([details](#json-match-1)) with all the match data.
If not, the request has been corrupted
```JSON
{
    "ID": 33,
    "Score_user1": 0,
    "Score_user2": 0,
    "Status": 2,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 190,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 110,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```
-----------

## Chat

### All the data from a conversation

```http
  GET /conv/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Conversation id |

#### Return;

Returns an object ([details](#json-conv-1)) with all the conversation data (messages, users, admins, muted users...).

```JSON
{
    "ID": 1,
    "Name": "Conversation 1",
    "Status": 1,
    "Password": null,
    "Messages": [
        {
            "data": "Salut User2, comment ça va ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:00:00"
        },
        {
            "data": "Salut User1, ça va bien merci ! Et toi ?",
            "ID_user": 2,
            "Logged_at": "2023-07-28T12:05:00"
        },
        {
            "data": "Je vais bien aussi, merci ! Que fais-tu aujourd'hui ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:10:00"
        }
    ],
    "Admin": [
        {
            "ID": 1,
            "ID_19": "user1_ID_19",
            "Pseudo": "User1",
            "Avatar": "user1_avatar_url",
            "Elo": 200,
            "Actual_skin": 3,
            "Global_skin": [
                1,
                2,
                3,
                4
            ],
            "Wins": 20,
            "Loses": 10
        }
    ],
    "Users": [
        {
            "ID": 1,
            "ID_19": "user1_ID_19",
            "Pseudo": "User1",
            "Avatar": "user1_avatar_url",
            "Elo": 200,
            "Actual_skin": 3,
            "Global_skin": [
                1,
                2,
                3,
                4
            ],
            "Wins": 20,
            "Loses": 10
        },
        {
            "ID": 2,
            "ID_19": "friend1_ID_19",
            "Pseudo": "User2",
            "Avatar": "friend1_avatar_url",
            "Elo": 100,
            "Actual_skin": 1,
            "Global_skin": [
                1,
                2,
                3
            ],
            "Wins": 10,
            "Loses": 5
        }
    ],
    "Muted": []
}
```


### Get all conversations for a user

```http
  GET /conv/${id}/user
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:

Returns an object ([details](#json-conv-2)) with basic info about all the conversations.
 
```JSON
[
    {
        "ID": 1,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    },
    {
        "ID": 3,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    }
]
```

### Ban a user from a conversation

```http
  GET /conv/:id/banned/:bannedId
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user to block |


### Add a user to a conversation

```http
  GET /conv/:id/users/:idUser
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user to add |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data

### Make a user an admin

```http
  GET /conv/:id/admins/:idAdmin
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user to be made admin |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data


### Mute a user

```http
  GET /conv/:id/muteds/:idMuted
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user to mute |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data


### Remove a user from a chat

```http
  GET /conv/:id/users/:idUser/remove
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | Id of the user to remove |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data


### Remove a user's admin status

```http
  GET /conv/:id/admins/:idAdmin/remove
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data


### Unmute a user

```http
  GET /conv/:id/muteds/:idMuted/remove
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data

### Send a message to a conversation

```http
  POST /conv/:id/message
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| id | int | User id |

#### Return:
Returns an object ([details](#json-conv-1)) with the updated data

-----------

# Details about the objects

## JSON User 1
```JSON
{
    "ID": 1,
    "ID_19": "user_ID_19",
    "Pseudo": "User",
    "Avatar": "user_avatar_url",
    "Elo": 200,
    "Actual_skin": 3,
    "Global_skin": [
        1,
        2,
        3,
        4
    ],
    "Wins": 20,
    "Loses": 10
}
```
- ID refers to the id in the DB, which will be used for API requests (unless specified in a specific request).
- ID_19 refers to 19 nickname, useless in this case
- Pseudo, speaks for itself
- Avatar: the url to the player's image
- Elo is the player's level, replacing coins
- Actual_skin is the current color of the pong bar
- Global_skin is the list of all the player's bar colors
- Wins is the total number of wins
- Loses is the total of... well, defeats

## JSON Match 1

```JSON
{
    "ID": 1,
    "Score_user1": 3,
    "Score_user2": 2,
    "Status": 1,
    "ID_user1": {
        "ID": 1,
        "ID_19": "user1_ID_19",
        "Pseudo": "User1",
        "Avatar": "user1_avatar_url",
        "Elo": 200,
        "Actual_skin": 3,
        "Global_skin": [
            1,
            2,
            3,
            4
        ],
        "Wins": 20,
        "Loses": 10
    },
    "ID_user2": {
        "ID": 2,
        "ID_19": "friend1_ID_19",
        "Pseudo": "User2",
        "Avatar": "friend1_avatar_url",
        "Elo": 100,
        "Actual_skin": 1,
        "Global_skin": [
            1,
            2,
            3
        ],
        "Wins": 10,
        "Loses": 5
    }
}
```
- ID refers to the match id
- Score_user1: points scored by player 1
- Score_user2: points scored by player 2
- Status: 0 is searching, 1 is in progress, 2 is finished
- ID_user1 gives all info on player 1, see [details](#json-user-1)
- ID_user2 gives all info on player 2, see [details](#json-user-1)

## JSON Conv 1

```JSON
{
    "ID": 1,
    "Name": "Conversation 1",
    "Status": 1,
    "Password": null,
    "Messages": [
        {
            "data": "Salut User2, comment ça va ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:00:00"
        },
        {
            "data": "Salut User1, ça va bien merci ! Et toi ?",
            "ID_user": 2,
            "Logged_at": "2023-07-28T12:05:00"
        },
        {
            "data": "Je vais bien aussi, merci ! Que fais-tu aujourd'hui ?",
            "ID_user": 1,
            "Logged_at": "2023-07-28T12:10:00"
        }
    ],
    "Admin": [...],
    "Users": [...],
    "Muted": [...]
}
```
- ID is the conversation id
- Name is the name of the conversation
- Status lets you know what type of conversation it is
	- 0 = public group chat
	- 1 = group chat with password
	- 2 = dialog
- Password, useful if status is 1
- Messages is a list of all messages
- Admins, Users and Muted are lists containing users see [details](#json-user-1)

## JSON Conv 2

```JSON
[
    {
        "ID": 1,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    },
    {
        "ID": 3,
        "Name": "Conversation 1",
        "Status": 1,
        "Password": null
    }
]
```

Objects made of:
- Conversation ID
- Conversation name
- Conversation status
	- 0 = public group chat
	- 1 = group chat with password
	- 2 = dialog
- Password, useful if status is 1

## Pour Lisa

Pour ce qui est de tes requetes ca va se passer en deux temps sur deux user differents

```
USER 1                USER 2
/matches/1/search
Renvoi status 0
                      /matches/2/search   
                      Renvoi status 2
            Le match commence
/matches/end

```